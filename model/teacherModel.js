const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

    teacherStatus:{
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



const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;