const moogoose = require('mongoose');

require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

function connectToMongoDB(){
    moogoose.connect(MONGODB_URL);
    moogoose.connection.on('connected',() =>{
        console.log('Connected to MongoDB successfully');
    });

    moogoose.connection.on('error',(err) =>{
        console.log('Error Connecting to MongoDB', err);
    });
}
module.exports = {connectToMongoDB}