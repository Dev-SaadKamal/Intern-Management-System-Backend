require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dns = require("dns");

const authRoute = require('./routes/authRoute');
const taskRoute = require('./routes/taskRoute');
const submissionRoute = require('./routes/submissionRoute');
const userRoute = require('./routes/userRoute');
const assignmentRoute = require('./routes/assingementRoute');



dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
console.log("file started")
// Middleware
app.use(express.json());
app.use(cors({
    origin: "https://intern-management-system-eight.vercel.app",
    credentials: true
}));
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/submissions', submissionRoute);
app.use('/api/users', userRoute);
app.use('/api/assignments', assignmentRoute);


// Connect to MongoDB and start the server
connectDB().then(() => {
    app.listen(4000, () => {

        console.log('Server is running on port 4000');
    })
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});


