const express = require('express');
const router = express.Router();
const studentsController = require('../controller/studentController');
const {authenticateUser,authorizeRole} = require('../middleware/authMiddleware')


router.get('/', authenticateUser, authorizeRole(['teacher','admin']), studentsController.getAllStudents);
// router.post('/', userController.createUser);
router.get('/records', authenticateUser, authorizeRole(['student']),studentsController.getStudentByUserId);
router.get('/:studentId',authenticateUser, authorizeRole(['admin','teacher']), studentsController.getStudentsById);
router.delete('/:studentId',authenticateUser, authorizeRole(['admin','teacher']), studentsController.deleteStudent);
router.get('/course/:courseId',authenticateUser, authorizeRole(['admin','teacher']), studentsController.getStudentByCourse);
router.put('/',authenticateUser, authorizeRole(['admin','teacher']), studentsController.updateStudentDetails);

module.exports = router;
