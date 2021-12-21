const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Student = require('../models/Student');

// @desc    Register student
// @route   POST/api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    // register 
    const {name, email, password} = req.body; 

    // Create student
const student = await Student.create({
    name, email, password
});
    res.status(200).json({
        success: true,
        data: student
    });
});

// @desc    GET all Studentss
// @route   GET/api/v1/students
// @access  Public
exports.getStudents = asyncHandler(async (req, res, next) => {

    const students = await Student.find();
   res
      .status(200)
      .json({ success: true, count: students.length, data: students });
  
  });
  
  //  @desc    Get single student
  //   @route   GET /api/v1/student/:id
  //   @access  private/student
   
  exports.getStudent = asyncHandler(async (req, res, next) => {
      const student = await Student.findById(req.params.id).populate({
          path: "student",
          select: "title",
          strictPopulate: false
      });
      if (!student) {
          return next(
            new ErrorResponse(`No admin with the id of ${req.params.id}`),
            404
          );
        }
  
      res.status(200).json({
          success: true,
          data: student
      });
  });