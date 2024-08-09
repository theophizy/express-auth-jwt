const express = require('express');
const router = express.Router();
const teacherController = require('../controller/teacherController');
const {authenticateUser,authorizeRole} = require('../middleware/authMiddleware')


router.get('/', authenticateUser,authorizeRole(["admin"]), teacherController.getAllTeachers);
// router.post('/', userController.createUser);
router.get('/records', authenticateUser,authorizeRole(["teacher"]),teacherController.getTeacherByUserId);
router.get('/:teacherId', authenticateUser,authorizeRole(["admin"]), teacherController.getTeacherById);
router.delete('/:teacherId', authenticateUser,authorizeRole(["admin"]), teacherController.deleteTeacher);
router.put('/', authenticateUser,authorizeRole(["admin"]), teacherController.updateTeacherDetails);

module.exports = router;
