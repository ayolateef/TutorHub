const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  // log to console for dev
  console.log(err);

  // Mongoose ObjectId error
  if (err.name === "CastError") {
    const message = `Resourse not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
    // error.message = 
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field entered";
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.error).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  return res
    .status(err.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

module.exports = errorHandler;