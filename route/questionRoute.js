const express = require('express')

const router = express.Router()
const {authenticateUser,authorizeRole} = require('../middleware/authMiddleware')
const questionController = require('../controller/questionController')

router.post('/', authenticateUser,authorizeRole(["teacher"]),questionController.createQuestion)
router.get('/assessment/:assessmentId',authenticateUser,authorizeRole(["teacher","student","admin"]), questionController.getQuestionsByAssessmentId)
router.get('/:questionId', authenticateUser,authorizeRole(["teacher","student","admin"]), questionController.getQuestionById)
router.delete('/:questionId', authenticateUser,authorizeRole(["teacher","admin"]), questionController.deleteQuestion)
router.put('/', authenticateUser,authorizeRole(["teacher"]), questionController.updateQuestion)
module.exports = router
