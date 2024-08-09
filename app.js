const  express  = require("express");
const {connectToMongoDB} = require('./db');
const userRoute = require('./route/userRoute');
const teacherRoute = require('./route/teacherRoute');
const courseRoute = require('./route/courseRoute');
const assessmentRoute = require("./route/assessmentRoute")
const questionRoute = require("./route/questionRoute")
const studentRoute = require("./route/studentRoute")
const teacherCourseRoute = require('./route/teacherCourseRoute')
const cors = require('cors')
 require('dotenv').config()
const app = express()

app.use(cors());

const PORT = process.env.PORT || 3000

 app.use(express.json());

 app.use(express.urlencoded({extended:true}))

app.use("/api/v1/users", userRoute);
app.use("/api/v1/teachers", teacherRoute);
app.use("/api/v1/courses", courseRoute)
app.use("/api/v1/assessments", assessmentRoute)
app.use("/api/v1/questions", questionRoute)
app.use("/api/v1/students", studentRoute)
app.use("/api/v1/teacher-courses", teacherCourseRoute)
 // connecting to MongoDB
 connectToMongoDB();

 app.use('/', (req, res) => {
    res.status(200).send('app is working fine');
 })

app.listen(PORT, () => {
console.log(`Server running on port: http://localhost:${PORT}`)
})

