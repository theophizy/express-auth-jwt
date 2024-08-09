const express = require('express');

//const userModel = require('../model/userModel');
const teacherModel = require('../model/teacherModel');
const teacherCourseModel = require('../model/teacherCourseModel')


const asignCourseToTeachers = async (req, res) => {
    const {teacherId,courseId} = req.body

    try {
const CheckForDuplicate = await teacherCourseModel.findOne({teacher:teacherId, course:courseId})
if(CheckForDuplicate){
    return res.status(409).json({error:'The selected course has already been asigned to this Teacher'})
}
        const asignedCourse = await teacherCourseModel.create({
            teacher:teacherId,
            course:courseId
        })
        res.status(201).json({
            asignedCourse: asignedCourse,
            message: 'Course asigned successfully'
        })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create the course', error })
    }
}

const getAllAsignedCourses = async (req, res) => {

    try {
        const asignedCourseDetails = await teacherCourseModel.find({}).populate({
            path: 'teacher',
            select: ['firstName', 'lastName']
        })
            .populate({
                path: 'course',
                select: ['courseTittle', 'courseCode']
            })
        if (asignedCourseDetails.length < 1) {
            return res.status(404).json({ error: 'No courses have been asigned to teachers' })
        }
        res.status(200).json(asignedCourseDetails)
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve students' })
    }
}

const getasignedCourseById = async (req, res) => {
    const { teacherCourseId } = req.params;
    try {
        const courseasigned = await teacherCourseModel.findById(teacherCourseId).populate({
            path: 'teacher',
            select: ['firstName', 'lastName']
        })
            .populate({
                path: 'course',
                select: ['courseTittle', 'courseCode']
            });
        if (!courseasigned) {
            return res.status(404).json({ message: 'Asigned course not found' });
        }
        res.status(200).json(courseasigned);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve student' })
    }
}

const getYourAsignedCources = async (req, res) => {

    const userId = req.user.userId;

    try {
        // return teachers record based on the userId including users details without password
        const teacherRecords = await teacherModel.findOne({ user: userId })
        if (!teacherRecords) {
            return res.status(404).json({ error: 'Record not found for the login teacher' });
        }
        const getMyCourses = await teacherCourseModel.find({ teacher: teacherRecords._id })
            .populate({
                path: 'course',
                select: ['courseTittle', 'courseCode']
            });
        if (getMyCourses.length < 1) {
            return res.status(404).json({ error: 'Courses have not been asigned to you' })
        }
        res.json(getMyCourses)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Faild to retrieve your courses', error })
    }
}

const updateAsignedCourse = async (req, res) => {
    const { teacherId, courseId, teacherCourseId} = req.body;
    try {
        const updatedAsignedCourse = await teacherCourseModel.findByIdAndUpdate(teacherCourseId, {
            teacher: teacherId,
            course: courseId,
        },
            { new: true }
        );

        if (!updatedAsignedCourse) {
            return res.status(404).json({ message: 'Asigned course not found' })
        }
        res.status(200).json(updatedAsignedCourse);

    } catch (error) {
        res.status(500).json({ error: 'Failed to modify teacher', error })
    }
}



const deleteAsignedCourse = async (req, res) =>{
const {teacherCourseId} = req.params

try{
    const deleteResult = await teacherCourseModel.deleteOne({_id: teacherCourseId})
    if (deleteResult.deletedCount === 0) {
        // No record found to delete
        return res.status(404).json({ message: 'Record not found' });
    }

    // Record deleted successfully
    res.status(200).json({ message: 'Record deleted successfully' });
    
}catch(error){
    res.status(500).json({error: 'Could not delete the resource'})
}
}

module.exports = {
    asignCourseToTeachers,
    getAllAsignedCourses,
    getasignedCourseById,
    getYourAsignedCources,
    updateAsignedCourse,
    deleteAsignedCourse
    
}