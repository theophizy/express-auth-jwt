const express = require('express')
const assessmentProgresstMdel = require('../model/assessmentProgressModel')
const assessmentModel = require('../model/assessmentModel')
const studentModel = require('../model/studentModel')
const questionModel = require('../model/questionModel')
const resultModel = require('../model/resultModel')
//const studentAnswerModel = require('../model/studentAnswerModel')


// Endpoint to start the assessment and fetch the first question
const start = async (req, res) => {
    const userId = req.user.userId;
    const assessmentId = req.params.assessmentId;

    try {
        const assessmentDetails = await assessmentModel.findById(assessmentId)
        if (!assessmentDetails) {
            return res.status(404).json({ message: 'Assessment not found' })
        }
        const currentDate = new Date();
        if (assessmentDetails.startDate > currentDate || assessmentDetails.endDate < currentDate) {
            return res.status(400).send('Assessment not available');
        }
        const student = await studentModel.findOne({ user: userId })
        if (!student) {
            return res.status(404).json({ message: 'Student not found' })
        }
        const studentId = student._id
        // Check if the student has already taken this assessment
        const existingProgress = await assessmentProgresstMdel.findOne({ student: studentId, assessment: assessmentId });
        if (existingProgress) {
            return res.status(400).json({ error: 'You have already taken this assessment.' });
        }

        // Fetch the questions for the assessment from the database
        const questions = await questionModel.find({ assessment: assessmentId }).sort({ createAt: 1 });
        if (questions.length === 0) {
            return res.status(404).json({ error: 'No questions found for this assessment.' });
        }

        // Record the start time of the assessment and calculate the end time
        const startTime = new Date().toUTCString() //new Date();
        
        const duration = assessmentDetails.duration;
        const endTime = new Date(new Date(startTime).getTime() + duration * 60000).toISOString();
       // const durationInMiliseconds = durationInMinutes * 60000
       // const endTime = new Date(startTime.getTime() + durationInMiliseconds);
       
        // Store the assessment progress in the database
        const progress = new assessmentProgresstMdel({
            student: studentId,
            assessment: assessmentId,
            startTime,
            endTime,
            currentIndex: 0,
            answers: [],
            totalScore: 0,
            totalQuestions: questions.length
        });
        await progress.save();

        // Send the first question and the end time to the user
        const firstQuestion = questions[0];
        res.status(200).json({ question: firstQuestion, endTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Endpoint to answer a question and fetch the next question
const submit = async (req, res) => {
    const { studentOption } = req.body;
    const assessmentId = req.params.assessmentId;
    const userId = req.user.userId;
    try {
        const student = await studentModel.findOne({ user: userId })
        if (!student) {
            return res.status(404).json({ message: 'Student not found' })
        }
        const studentId = student._id
        // Fetch the assessment progress from the database
        const progress = await assessmentProgresstMdel.findOne({ student: studentId, assessment: assessmentId });
        if (!progress) {
            return res.status(400).json({ error: 'Assessment not started.' });
        }

        // Fetch the questions for the assessment from the database
        const questions = await questionModel.find({ assessment: assessmentId }).sort({ createAt: 1 });
        if (questions.length === 0) {
            return res.status(404).json({ error: 'No questions found for this assessment.' });
        }
        // Get assessment details
        const assessmentDetails = await assessmentModel.findById(assessmentId)
        if (!assessmentDetails) {
            return res.status(404).json({ message: 'Assessment not found' })
        }
        // Check if the assessment duration has elapsed
        const currentTime = new Date().toISOString();
        
        const progressEndTime = (progress.endTime).toISOString()
        
        //const elapsedTime = currentTime - progress.startTime;
        if (currentTime > progressEndTime) {
            // Assessment duration exceeded, calculate and return the total score
            const totalScore = calculateTotalScore(progress.answers);
            const percentageScores = `${(totalScore / assessmentDetails.maximumScore) * 100}%`
 CreateStudentResult(assessmentId,studentId,totalScore, percentageScores)

            return res.status(200).json({ message: 'Assessment duration exceeded.', TotalScores: totalScore, PercentageScores: percentageScores });
        }

        // Get the current question index
        const currentIndex = progress.currentIndex;

        // Fetch the current question
        const currentQuestion = questions[currentIndex];

        // Record the answer in the progress
        const isCorrect = currentQuestion.correctAnswer == studentOption;
        const score = isCorrect ? currentQuestion.marks : 0;
        progress.totalScore += score;
        progress.answers.push({ question: currentQuestion.text, answer: studentOption, isCorrect, score });

        // Update the current index to move to the next question
        progress.currentIndex += 1;

        // Save the updated progress
        await progress.save();

        // Check if there are more questions
        if (progress.currentIndex < progress.totalQuestions) {
            // Send the next question to the user
            const nextQuestion = questions[progress.currentIndex];
            res.status(200).json({ question: nextQuestion });
        } else {
            // Assessment completed, calculate and return the total score
            const totalScore = calculateTotalScore(progress.answers);
            const percentageScores = `${(totalScore / assessmentDetails.maximumScore) * 100}%`
            CreateStudentResult(assessmentId,studentId,totalScore, percentageScores)
            res.status(200).json({ message: 'Assessment completed successfully.', TotalScores: totalScore, PercentageScores: percentageScores });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getStudentResult = async (req, res) => {
    const assessmentId = req.params.assessmentId;
    const userId = req.user.userId;
    try {
        const student = await studentModel.findOne({ user: userId })
        if (!student) {
            return res.status(404).json({ message: 'Student not found' })
        }
        const studentId = student._id
        const studentResult = await resultModel.findOne({assessment:assessmentId, student:studentId})
        if(!studentResult){
            return res.status(404).json({message:'No result found for the selected assessment'})
        }
        res.json(studentResult)
    }catch(error){
        res.status(500).json({error:'Oops! an error occured at the server', error})
    }
}
// Function to calculate user's total score for all questions
function calculateTotalScore(answers) {
    let totalScore = 0;
    answers.forEach(answer => {
        totalScore += answer.score;
    });
    return totalScore;
}

async function CreateStudentResult(assessmentId,studentId,totalScores, percentageScore){
await resultModel.create({
    assessment:assessmentId,
    student:studentId,
    totalScore:totalScores,
    percentageScore:percentageScore
})
}

const teacherAndAdminGetStudentResultByAssessmentId = async (req, res) => {
    const assessmentId = req.params.assessmentId;
    
    try {
       
        const studentResultDetails = await resultModel.find({assessment:assessmentId})
        .populate({
            path : 'assessment',
            select: 'assessmentTittle'
        })
        .populate({
            path: 'student',
            select:['firstName','lastName']
        });
        if(!studentResultDetails){
            return res.status(404).json({message:'No result found for the selected assessment'})
        }
        res.json(studentResultDetails)
    }catch(error){
        res.status(500).json({error:'Oops! an error occured at the server', error})
    }
}

const studentViewAllResults = async (req, res) => {
    const userId = req.user.userId;
    try {
        const studentDetails = await studentModel.findOne({ user:userId })
        
        if (!studentDetails) {
            return res.status(404).json({ message: 'Student not found' })
        }
        const studentId = studentDetails._id
        console.log(studentId)
        const studentResults = await resultModel.find({student:studentId})
        .populate({
            path: 'assessment',
            select: 'assessmentTittle',
            populate: [ {
                path: 'teacher',
                select: ['firstName', 'lastName']
            },
            {
                path: 'course',
                select: ['courseTittle', 'courseCode']
            }
        ]
        });
       
        if(!studentResults){
            return res.status(404).json({message:'No result found'})
        }
        res.json(studentResults)
    }catch(error){
        res.status(500).json({error:'Oops! an error occured at the server', error})
    }
}
module.exports = {
    start,
    submit,
    getStudentResult,
    teacherAndAdminGetStudentResultByAssessmentId,
    studentViewAllResults
}