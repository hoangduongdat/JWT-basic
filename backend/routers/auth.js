const authController = require('../controllers/authController');
const middlewareControllor = require('../controllers/middlewareControllor');

const router = require('express').Router();

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", middlewareControllor.verifyToken, authController.userLogout)
router.post("/refresh", authController.requestRefreshToken)


module.exports = router