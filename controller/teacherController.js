const express = require('express');

const userModel = require('../model/userModel');
const teacherModel = require('../model/teacherModel');

const getAllTeachers = async (req, res) => {

    try {
        const teachers = await teacherModel.find({});
        if(teachers.length < 1){
            return res.status(404).json({error : 'No avaliable teachers'})
        }
        res.status(200).json(teachers)
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve teachers' })
    }
}

const getTeacherById = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const teacher = await teacherModel.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve teacher' })
    }
}

const getTeacherByUserId = async (req, res) => {
    
    const userId = req.user.userId;
    
    try {
        // return teachers record based on the userId including users details without password
        const teacherRecords = await teacherModel.findOne({ user: userId })
        if(!teacherRecords){
            return rest. status(404).json({message:'Teacher no found'})
        }
        res.status(200).json(teacherRecords);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server issues. to retrieve teacher' ,error})
    }
}

const updateTeacherDetails = async (req, res) => {
    const { firstName, middleName, lastName, dateOfBirth, gender, teacherId } = req.body;
    try {
        const updatedTeacher = await teacherModel.findByIdAndUpdate(teacherId, {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            gender: gender,
        },
            { new: true }
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' })
        }
        res.status(200).json(updatedTeacher);

    } catch (error) {
        res.status(500).json({ error: 'Failed to modify teacher', error })
    }
}

const deleteTeacher = async (req , res) => {
    const {teacherId} = req.params
    try {
        const deletedTeacher = await teacherModel.findByIdAndDelete(teacherId);
        if (deletedTeacher) {
            // Delete the associated user record
            await userModel.findByIdAndDelete(deletedTeacher.user);
            res.status(200).json({ message: 'Teacher deleted successfully' });
        }
    } catch (error) {
        console.error("Error deleting student:", error);
    }
}

module.exports = {
    getAllTeachers,
    getTeacherById,
    getTeacherByUserId,
    updateTeacherDetails,
    deleteTeacher
}