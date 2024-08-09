const mongoose = require('mongoose');
const Course = require('./courseModel');

const studentSchema = new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Course,
    required: true,
},
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required:true
    },
    gender: {
        type: String,
        enum: ['Male','Female'],
    },
    dateOfBirth: {
        type: String,
        required: true,
    },

    studentStatus:{
        type: String,
        enum: ['ACTIVE','INACTIVE'],
        default: 'ACTIVE'
    },
    createAt:{
        type: Date,
        default: Date.now
    },
    lastUpdateAt:{
        type: Date,
        default: Date.now
    }
});



const Student = mongoose.model('Student', studentSchema);
module.exports = Student;