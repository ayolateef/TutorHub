const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async')
const Admin = require("../models/Admin");

// @desc    Create an Admin
// @route   POST/api/v1/admins
// @access  Public
exports.createAdmin = asyncHandler(async(req, res, next) => {
  const DEFAULT_PASSWORD = "123456"
  
  const { name, email } = req.body
  const admin = await Admin.create({
    name, 
    email, 
    password: DEFAULT_PASSWORD
  })
  res.status(201)
  .json({success: true, data: admin})
})

// @desc    GET all Admins
// @route   GET/api/v1/admins
// @access  Public
exports.getAdmins = asyncHandler(async (req, res, next) => {

  const admins = await Admin.find();
 res
    .status(200)
    .json({ success: true, count: admins.length, data: admins });

});

  // @desc    GET all  admins
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
      strictPopulate: false
    });
  }

  const superadmin = await query;

  res.status(200).json({
    success: true,
    data: superadmin
  });
});

//  @desc    Get single admin
//   @route   GET /api/v1/admin/:id
//   @access  private/admin
 
exports.getAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id).populate({
        path: "subjects",
        select: "title",
        strictPopulate: false
    });
    if (!admin) {
        return next(
          new ErrorResponse(`No admin with the id of ${req.params.id}`),
          404
        );
      }

    res.status(200).json({
        success: true,
        data: admin
    });
});
