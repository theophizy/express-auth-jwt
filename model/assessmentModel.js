const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
course:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
},
teacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
},
    assessmentTittle: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true
    },
   
endTime: {
    type: Date,
    required: true
},
maximumScore:{
    type: Number,
    required: true
},
duration: {
    type: Number,
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



const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;