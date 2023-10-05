const express = require('express');
const cors = require('cors');
const httpstatusText = require('./utils/httpstatusText');


require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors())
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('mongo_DB server started');
})

const coursesRoute = require('./routes/courses.route');
const usersRoute = require('./routes/users.route');





app.use('/api/courses', coursesRoute);
app.use('/api/users', usersRoute);



//global middleware for not found router 
app.all('*', (req, res, next) => {
    return res.status(404).json({
        status: httpstatusText.ERROR,
        data: null,
        message: "this resource not available"
    });
})


//global middleware for error handler 
app.use((error, req, res, next) => {
    return res.status(error.statusCode).json({
        status: error.statusText,
        data: null,
        message: error.message,
        code: error.statusCode
    });
})


app.listen(5000, () => {
    console.log('the server run in port 5000');
})

