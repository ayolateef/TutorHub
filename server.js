const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require('colors');
var cookieParser = require('cookie-parser')
const Joi = require('joi');
const errorHandler = require('./middleware/error')

const connectDB = require("./config/db");

//load env vars
dotenv.config();

//Connect to database
connectDB();

//Route files
const category= require('./routes/category');
const subject= require('./routes/subjects');
const superadmin= require('./routes/superadmin');
const admin= require('./routes/admin');
const auth = require('./routes/auth');
const tutor = require('./routes/tutor');
const student = require('./routes/student');


const app = express();

//Body Parser
app.use(express.json());

//cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

//   //file uploading
// app.use(fileupload());

// // Set static folder
// app.use(express.static(path.join(__dirname, 'public')))

//Mount routers
app.use('/api/v1/category', category);
 app.use('/api/v1/subject', subject);
 app.use('/api/v1/superadmin', superadmin);
 app.use('/api/v1/admin', admin);
 app.use('/api/v1/auth', auth);
 app.use('/api/v1/tutor', tutor);
 app.use('/api/v1/student', student);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;


const server = app.listen(
    PORT,() =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  );
  
  //Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(0));
  });