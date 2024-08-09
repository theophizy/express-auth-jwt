const express = require('express');
const router = express.Router();
const teacherCourseController = require('../controller/teacherCourseController');
const {authenticateUser,authorizeRole} = require('../middleware/authMiddleware')

router.post('/', authenticateUser,authorizeRole(["admin"]), teacherCourseController.asignCourseToTeachers)
router.get('/',authenticateUser,authorizeRole(["admin"]), teacherCourseController.getAllAsignedCourses);
// router.post('/', userController.createUser);
router.get('/teacher/', authenticateUser, authorizeRole(['teacher']),teacherCourseController.getYourAsignedCources);
router.get('/:teacherCourseId', authenticateUser,authorizeRole(["admin"]), teacherCourseController.getasignedCourseById);

router.put('/', authenticateUser,authorizeRole(["admin"]), teacherCourseController.updateAsignedCourse);
router.delete('/:teacherCourseId', authenticateUser,authorizeRole(["admin"]), teacherCourseController.deleteAsignedCourse);
module.exports = router;