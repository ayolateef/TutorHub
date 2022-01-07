const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async')
const SuperAdmin = require("../models/SuperAdmin");

// @desc    POST create
// @route  POST/api/v1/superadmin/
// @access  Public

exports.createSuperadmin = asyncHandler(async (req, res, next) => {
    const superadmin = await SuperAdmin.create(req.body);
    res.status(201).json({ success: true, data: superadmin });
});

// @desc   login SuperAdmin
// @route   POST/api/v1/superadmin/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const {username, password } = req.body;
  
    // Validate username & password
    if (!username || !password) {
      return next(new ErrorResponse("Please provide a valid username and password", 400));
    }
    // Check for the superadmin
    const superadmin = await SuperAdmin.findOne({ username }).select("+password");
  
    if (!superadmin) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    // Check if password matches
    const isMatch = await superadmin.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
  })
  
  // @desc    GET all admins
// @route   GET/api/v1/superadmin
// @access  Public

exports.getAllAdmins = asyncHandler(async (req, res, next) => {
  let query;
  // check if the admin exist
  if (req.params.AdminId) {
    query = Admin.find({ category: req.params.adminId });
  } else {
    query = Admin.find().populate({
      path: "superadmin",
      select: "name description",
    });
  }

  const superadmin = await query;

  res.status(200).json({
    success: true,
    data: superadmin
  });
});