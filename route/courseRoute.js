const express = require('express')

const router = express.Router()

const courseController = require('../controller/courseController')
const {authenticateUser,authorizeRole} = require('../middleware/authMiddleware')

router.post('/',authenticateUser,authorizeRole(["admin"]), courseController.createCourse)
router.get('/', authenticateUser,authorizeRole(["admin"]), courseController.getAllCourse)
router.get('/:courseId', authenticateUser,authorizeRole(["admin"]), courseController.getCourseById)
router.delete('/:courseId', authenticateUser,authorizeRole(["admin"]), courseController.deleteCourse)
router.put('/', authenticateUser,authorizeRole(["admin"]), courseController.updateCourse)
module.exports = router
