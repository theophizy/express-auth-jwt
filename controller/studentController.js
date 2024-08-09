const express = require('express');

const userModel = require('../model/userModel');
const teacherModel = require('../model/teacherModel');
const studentModel = require('../model/studentModel')

const getAllStudents = async (req, res) => {

    try {
        const students = await studentModel.find({}).populate({
            path: 'user',
            select: 'email'
        })
        .populate({
            path: 'course',
            select: ['courseTittle','courseCode']
        })
        if(students.length < 1){
            return res.status(404).json({error : 'No avaliable students'})
        }
        res.status(200).json(students)
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve students' })
    }
}

const getStudentsById = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await studentModel.findById(studentId).populate({
            path: 'course',
            select: ['courseTittle','courseCode']
        });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve student' })
    }
}

const getStudentByUserId = async (req, res) => {
    
    const userId = req.user.userId;
    
    try {
        // return teachers record based on the userId including users details without password
        const studentRecords = await studentModel.findOne({ user: userId }).populate({
            path: 'course',
            select: ['courseTittle','courseCode']
        })
        res.status(200).json(studentRecords);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server issues. to retrieve student' ,error})
    }
}

const updateStudentDetails = async (req, res) => {
    const { firstName, middleName, lastName, dateOfBirth, gender, studentId,courseId } = req.body;
    try {
        const updatedStudent = await studentModel.findByIdAndUpdate(studentId, {
            course:courseId,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            gender: gender,
        },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' })
        }
        res.status(200).json(updatedStudent);

    } catch (error) {
        res.status(500).json({ error: 'Failed to modify teacher', error })
    }
}

const getStudentByCourse = async (req, res) =>{
const {courseId} = req.params

try{
const students = await studentModel.find({course:courseId })
.populate({
    path: 'user',
    select: 'email'
})
.populate({
    path: 'course',
    select: ['courseTittle','courseCode']
})
if(students.length < 1){
    return res.status(404).json({error:'No students for the selected course'})
}
res.json(students)
}catch(error){
    res.status(500).json({error:'Could not retrieve student in the selected course',error})
}
}

const deleteStudent = async (req , res) => {
    const {studentId} = req.params
    try {
        const deletedStudent = await studentModel.findByIdAndDelete(studentId);
        if (deletedStudent) {
            // Delete the associated user record
            await userModel.findByIdAndDelete(deletedStudent.user);
            res.status(200).json({ message: 'Student deleted successfully' });
        }
    } catch (error) {
        console.error("Error deleting student:", error);
    }
}

module.exports = {
    getAllStudents,
    getStudentsById,
    getStudentByUserId,
    updateStudentDetails,
    getStudentByCourse,
    deleteStudent
}