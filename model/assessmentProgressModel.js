const mongoose = require('mongoose');

const assessmentProgressSchema = new mongoose.Schema({
    student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  answers: [{
    question: String, // Question text
    answer: String,  // User's answer
    isCorrect: Boolean,
    score: Number
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  }
});

const AssessmentProgress = mongoose.model('AssessmentProgress', assessmentProgressSchema);

module.exports = AssessmentProgress;