const mongoose = require('mongoose');

const teacherCourseSchema = new mongoose.Schema({
teacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
},
course:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
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



const TeacherCourse = mongoose.model('TeacherCourse', teacherCourseSchema);
module.exports = TeacherCourse;