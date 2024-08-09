const express = require('express')

const questionModel = require('../model/questionModel')

const userModel = require('../model/userModel')

const assessmentModel = require('../model/assessmentModel')

const createQuestion = async (req, res) => {
    //const { assessmentId,text,options,correctAnswer,marks } = req.body
    const requestData = Array.isArray(req.body) ? req.body : [req.body];
        //const assessment = await assessmentModel.findById(requestData.assessment)
        const assessmentIds = [...new Set(requestData.map(q => q.assessment))];
        const assessments = await assessmentModel.find({
          '_id': { $in: assessmentIds }
        });
      
        if (assessments.length !== assessmentIds.length) {
          return res.status(400).json({message:'One or more assessments do not exist.'});
        }
        // Create the questions
 try {
          const createdQuestions = await questionModel.insertMany(requestData);
          res.status(201).send(createdQuestions);
        } catch (error) {
          res.status(500).send(error.message);
        }

}

const getQuestionById = async (req, res) => {
    const { questionId } = req.params
    try {
        const avaliableQuestions = await questionModel.findById(questionId)
        if (!avaliableQuestions) {
            return res.status(404).json({ error: 'Question not found' })
        }
        res.status(200).json(avaliableQuestions)
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve questions', error })
    }
}

const getQuestionsByAssessmentId = async (req, res) => {
    const { assessmentId } = req.params
    try {
        const getquestions = await questionModel.find({ assessment: assessmentId })
        if (getquestions.lenght < 1) {
            return res.status(404).json({ error: 'No questions for the selected assessment' })
        }
        res.status(200).json(getquestions)
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve questions', error })
    }
}

const updateQuestion = async (req, res) => {
    const { questionId, text, options, correctAnswer, marks } = req.body
    try {

        const updatedQuestion = await questionModel.findByIdAndUpdate(questionId,
            {
                text: text,
                options: options,
                correctAnswer: correctAnswer,
                marks: marks
            })
        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Question not found' })
        }
        res.status(200).json(updatedQuestion)

    } catch (error) {
        res.status(500).json({ error: 'Failed to update question', error })
    }
}

const deleteQuestion = async (req, res) =>{
    const {questionId} = req.params
    
    try{
        const deletedQuestion = await questionModel.deleteOne({_id:questionId})
        if (deletedQuestion.deletedCount === 0) {
            // No record found to delete
            return res.status(404).json({ message: 'Question not found' });
        }
    
        // Record deleted successfully
        res.status(200).json({ message: 'Question deleted successfully' });
        
    }catch(error){
        res.status(500).json({error: 'Could not delete the resource'})
    }
    }

module.exports = {
    createQuestion,
    getQuestionsByAssessmentId,
    getQuestionById,
    updateQuestion,
    deleteQuestion
}