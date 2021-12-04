const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require('colors');
const errorHandler = require('./middleware/error')

const connectDB = require("./config/db");


//load env vars
dotenv.config();

//Connect to database
connectDB();

//Route files
const category= require('./routes/category');


const app = express();

//Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

//Mount routers
app.use('/api/v1/category', category);

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