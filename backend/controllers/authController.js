const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens = []

const authController = {
    register: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            try {
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashed,
                })
                console.log(newUser)
                const user = await newUser.save();
                res.status(200).json(user);
            } catch (e) {
                console.log(e)
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    // Generate access token
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "5m" })
    },

    // Generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" })
    },

    login: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username })
            if (!user) {
                res.status(404).json("wrong user name")
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) {
                res.status(404).json("wrong password")
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user)
                const refreshToken = authController.generateRefreshToken(user)
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })

                const { password, ...others } = user._doc
                res.status(200).json({ others, accessToken })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },

    requestRefreshToken: async (req, res) => {
        //take refresh token to user
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken)
            return res.status(401).json("you are not authenticated")

        if (!refreshTokens.includes(refreshToken))
            return res.status(403).json("refresh token is not valid")

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) return res.status(404).json("not valid token")

            refreshTokens = refreshTokens.filter(token => token !== refreshToken)
            // create new access token and  refresh token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newAccessToken)

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            })

            res.status(200).json({ accessToken: newAccessToken })

        })
    },

    userLogout: async (req, res) => {
        res.clearCookie("refreshToken")
        refreshTokens = refreshTokens.filter(token !== req.cookies.refreshToken)
        res.status(200).json("logout success")
    }

}

module.exports = authController