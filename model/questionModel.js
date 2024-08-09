const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    assessment:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
},
    text: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: String,
        required:true
    },
    marks: {
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



const Question = mongoose.model('Question', questionSchema);
module.exports = Question;