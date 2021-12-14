const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Tutor = require("../models/Tutor");

const DEFAULT_PASSWORD = "123456";

// @desc   register tutor
// @route   POST/api/v1/admins
// @access  Public
exports.createTutor = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const tutor = await Tutor.create({
    name,
    email,
    password: DEFAULT_PASSWORD,
  });
  res.status(201).json({ success: true, data: tutor });
});

// @desc    GET all Tutors
// @route   GET/api/v1/tutor
// @access  Public
exports.getTutors = asyncHandler(async (req, res, next) => {
  const tutors = await Tutor.find();
  res.status(200).json({ success: true, count: tutors.length, data: tutors });
});
//  @desc    Get a tutor
//   @route   GET /api/v1/tutor/:id
//   @access  private/tutor

exports.getTutor = asyncHandler(async (req, res, next) => {
  const tutor = await Tutor.findById(req.params.id).populate({
    path: "subject",
    select: "title",
    model: "Subject",
    strictPopulate: false,

    path: "category",
    select: "name",
    model: "Category",
    strictPopulate: false,
  });

  if (!tutor) {
    return next(
      new ErrorResponse(`No admin with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: tutor,
  });
});

//  @desc   Update  tutor
//   @route   PUT /api/v1/tutor/:id
//   @access  private/tutor

exports.addTutor = asyncHandler(async (req, res, next) => {
  const tutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate({
    path: "subject",
    select: "title",
    model: "Subject",
    strictPopulate: false,

    path: "category",
    select: "name",
    model: "Category",
    strictPopulate: false,
  });

  if (!tutor) {
    return next(
      new ErrorResponse(`No tutor with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: tutor,
  });
});
