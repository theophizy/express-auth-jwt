const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
asssessment:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
},
Question:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
    userAnswer: {
        type: String,
        required: true,
    },
    score:{
        type: Number,
        default: 0,
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



const Answer = mongoose.model('Answer', studentSchema);
module.exports = Answer;