const middlewareControllor = require('../controllers/middlewareControllor');
const userController = require('../controllers/userController');


const router = require('express').Router();

router.get('/', middlewareControllor.verifyToken, userController.getAllUser)
router.delete('/:id', middlewareControllor.verifyTokenRole, userController.deleteUser)



module.exports = router