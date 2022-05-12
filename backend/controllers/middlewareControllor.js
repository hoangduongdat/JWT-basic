const jwt = require('jsonwebtoken');

const middlewareControllor = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid")

                }
                req.user = user;
                next();
            })
        }
        else {
            res.status(401).json("you are not authenticated")
        }
    },

    verifyTokenRole: function (req, res, next) {
        middlewareControllor.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin) {
                next();
            } else {
                res.status(403).json("you are not allowed to delete other")
            }
        })
    }
}

module.exports = middlewareControllor;