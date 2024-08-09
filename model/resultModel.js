const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
assessment:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
},
student:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
},
    totalScore:{
        type: Number,
        required: true
    },
    percentageScore:{
        type: String,
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



const Result = mongoose.model('Result', resultSchema);
module.exports = Result;