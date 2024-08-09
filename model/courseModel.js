const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseTittle: {
        type: String,
        required: true,
    },
    courseCode: {
        type: String,
        required: true
    },
    courseStatus: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
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



const Course = mongoose.model('Course', courseSchema);
module.exports = Course;