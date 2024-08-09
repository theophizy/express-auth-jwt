const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const config = require('../config');
const sendWelcomeEmail = require('../email')
const userModel = require('../model/userModel');
const teacherModel = require('../model/teacherModel');
const studentModel = require('../model/studentModel');

const createUser = async (req, res) => {

    const { email, password, role, userStatus,firstName, middleName, lastName, dateOfBirth,gender,courseId } = req.body;
    try {
        
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' })
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
       const newUser = await userModel.create({
            email,
            password: hashedPassword,
            role: role,
            userStatus,
        });
        if(role == "student"){
            
            const newStudent = await studentModel.create({user:newUser._id,course:courseId,firstName,middleName,lastName,gender,dateOfBirth, courseId});
            //sendWelcomeEmail.sendWelcomeEmail(newUser.email,password)
            res.status(201).json({
                user: newUser,
                student: newStudent,
                message: 'User and Student created successfully. Student login credentials has been sent his/her email address',
            });   
        }
        if(role == "teacher"){
            const newTeacher = await teacherModel.create({ user:newUser._id,firstName,middleName,lastName,gender,dateOfBirth});
           // sendWelcomeEmail.sendWelcomeEmail(newTeacher.email,password)
            res.status(201).json({
                user: newUser,
                Teacher: newTeacher,
                message: 'User and Teacher created successfully. Teacher login credentials has been sent his/her email address',
            });
        }
       
} catch (error) {
        res.status(500).json({ error: 'Internal Server Error',error })
    }

}

const getAllUsers = async (req, res) => {

    try {
        const users = await userModel.find({});
        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieved users', error })
    }
}

const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const userDetails = await userModel.findById(userId);
        if(!userDetails) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(userDetails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieved user', error })
    }
}

function generateToken(user){
    return jwt.sign({
        user:{
            userId: user._id,
            role: user.role
        }
    }, config.jwtSecret, 
    {
        expiresIn: '1d'
    }
    )
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    
    // Authenticate User
try{
    const user = await userModel.findOne({email:email,userStatus:'ACTIVE'});
    
    if(!user){
        return res.status(404).json({error:'User not found'})
    }
const isMatch = await bcrypt.compare(password, user.password)

if(!isMatch){
    return res.status(401).json({error: 'Invalid credentials'})
}
    
const token = jwt.sign({ 
    user: {
         userId: user._id, role: user.role
         } 
        }, 
        config.jwtSecret, {
    expiresIn: '1d'
  });
 
 res.json({token})
    
}catch(error){
    res.status(500).json({error:'Could not authenticate user', error})
}
}

const modifyUserAccount = async (req, res) => {
    const { userId } = req.params;
    const {userStatus} = req.body;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, {userStatus:userStatus}, { new: true })
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user', error })
    }
}

const userLogout = async (req, res) => {
    
    res.status(200).json({ message: 'Logout successful'});
};



// Route for changing password
const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.userId; 

    try {
        // Fetch user from the database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Check if new password and confirm new password match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: 'New password and confirm new password do not match' });
        }

        // Hash the new password
        //const hashedPassword = await bcrypt.hash(newPassword, 10);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Update user's password
        user.password = hashedPassword;
        await user.save();

        // Respond with success message
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    modifyUserAccount,
    userLogin,
    userLogout,
    changePassword
}