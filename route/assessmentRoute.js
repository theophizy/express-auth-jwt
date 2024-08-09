const express = require('express');
const assesmentController = require('../controller/assessmentController');
const {authenticateUser,authorizeRole} = require('../middleware/authMiddleware')
const testAssessmentController = require('../controller/testController')
const router = express.Router();

router.get('/', authenticateUser,authorizeRole(["admin"]),assesmentController.getAllAssessments);
router.post('/', authenticateUser,authorizeRole(["teacher"]), assesmentController.createAssessment);
//router.get('/:userId', userController.getUserById);
router.get('/allResults',authenticateUser,authorizeRole(["student"]),testAssessmentController.studentViewAllResults)
router.get('/:assessmentId', authenticateUser,authorizeRole(["teacher","student","admin"]), assesmentController.getAssessmentById);
router.delete('/:assessmentId', authenticateUser,authorizeRole(["teacher","admin"]), assesmentController.deleteAssessment);
router.get('/course/:courseId', authenticateUser, assesmentController.getAsssessmentByCourseId)
router.get('/user/:courseId', authenticateUser,authorizeRole(["teacher"]),assesmentController.getAsssessmentByCourseIdandSignInTeacher)
router.put('/',authenticateUser,authorizeRole(["teacher","admin"]),assesmentController.updateAssessment)
router.post('/:assessmentId/submit',authenticateUser,authorizeRole(["student"]),testAssessmentController.submit)
router.post('/:assessmentId/start',authenticateUser,authorizeRole(["student"]),testAssessmentController.start)

router.get('/:assessmentId/result',authenticateUser,authorizeRole(["student"]),testAssessmentController.getStudentResult)

router.get('/:assessmentId/getResult',authenticateUser,authorizeRole(["teacher","admin"]),testAssessmentController.teacherAndAdminGetStudentResultByAssessmentId)

module.exports = router;
