const User = require('../models/User')

const userController = {
    getAllUser: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users)
        } catch (err) {
            res.status(500).json(err)
        }
    },

    deleteUser: async (req, res) => {
        try {
            console.log(req.params.id)
            const user = await User.findByIdAndDelete(req.params.id);

            res.status(200).json("delete successfully")
        } catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = userController

