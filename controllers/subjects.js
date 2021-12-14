const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Subject = require("../models/Subject");
const Category = require("../models/Category");

// @desc    GET all subjects
// @route   GET/api/v1/subjects
// @route   GET/api/v1/categories/:categoryId/subjects
// @access  Public

exports.getSubjects = asyncHandler(async (req, res, next) => {
  let query;
  // check if the category exist
  if (req.params.categoryId) {
    query = Subject.find({ category: req.params.categoryId });
  } else {
    query = Subject.find().populate({
      path: "category",
      select: "name description",
    });
  }

  const subjects = await query;

  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects,
  });
});

// @desc    GET single subject
// @route   GET/api/v1/subjects/:id
// @access  Public

exports.getSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id).populate({
    path: "category",
    select: "name description",
  });
  if (!subject) {
    return next(
      new ErrorResponse(`No subject with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: subject,
  });
});

// @desc    Add subject
// @route   POST/api/v1/category/:categoryId/subjects
// @access  Private

exports.addSubject = asyncHandler(async (req, res, next) => {
  // Get the category id submit to tve body
  req.body.category = req.params.categoryId;

  const category = await Category.findById(req.params.categoryId);

  // check if it exist
  if (!category) {
    return next(
      new ErrorResponse(`No category with the id of ${req.params.categoryId}`),
      404
    );
  }
  // create a new subject
  const subject = await Subject.create(req.body);

  res.status(200).json({
    success: true,
    data: subject,
  });
});

// @desc    Updatesubject
// @route   PUT/api/v1/subjects/:id
// @access  Private

exports.updateSubject = asyncHandler(async (req, res, next) => {
  // Fetch subject
  let subject = await Subject.findById(req.params.id);

  //Test for d subject
  if (!subject) {
    return next(
      new ErrorResponse(`No subject with the id of ${req.params.id}`),
      404
    );
  }
  //then update
  subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: subject,
  });
});

// @desc    Delete subject
// @route   DELETE/api/v1/subject/:id
// @access  Private

exports.deleteSubject = asyncHandler(async (req, res, next) => {
  // Fetch subject
  const subject = await Subject.findById(req.params.id);

  //Test for d subject
  if (!subject) {
    return next(
      new ErrorResponse(`No subject with the id of ${req.params.id}`),
      404
    );
  }
  //then remove
  await subject.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
