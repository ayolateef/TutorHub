const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async')
const Category = require("../models/Category");

// @desc    GET all categories
// @route   GET/api/v1/categories
// @access  Public

exports.getCategories = asyncHandler(async (req, res, next) => {

    const categories = await Category.find();

    res
      .status(200)
      .json({ success: true, count: categories.length, data: categories });

});

// @desc    GET single category
// @route   GET/api/v1/categories/:id
// @access  Public

exports.getCategory = asyncHandler(async (req, res, next) => {
 
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: category });
});

// @desc    POST category
// @route   GET/api/v1/categories
// @access  Public

exports.createCategories = asyncHandler(async (req, res, next) => {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  
});

// @desc    PUT category
// @route   GET/api/v1/categories/:id
// @access  Private

exports.updateCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: category });
 
});

// @desc    DELETE category
// @route   GET/api/v1/categories/:id
// @access  Private

exports.deleteCategory =asyncHandler (async (req, res, next) => {
 
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
});
