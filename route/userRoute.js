const express = require('express');
const userController = require('../controller/userController');
const {authenticateUser,authorizeRole} = require('../middleware/authMiddleware')
const router = express.Router();

router.get('/',  authenticateUser,authorizeRole(["admin"]), userController.getAllUsers);
router.post('/',  authenticateUser,authorizeRole(["admin","teacher"]), userController.createUser);
router.post('/login', userController.userLogin);
router.post('/logout', authenticateUser,userController.userLogout);
router.get('/:userId',  authenticateUser,authorizeRole(["admin"]), userController.getUserById);
router.put('/:userId',  authenticateUser,authorizeRole(["admin"]), userController.modifyUserAccount);
router.post('/change-password', authenticateUser,userController.changePassword);

module.exports = router;