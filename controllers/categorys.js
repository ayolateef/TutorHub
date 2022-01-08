const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');
const { validateCreateCategory, validateUpdateCategory } = require('../validation/category');

// @desc    GET all categories
// @route   GET/api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({}).populate('subjects').sort('-createdAt');

    res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        count: categories.length,
        data: categories,
    });
});

// @desc    GET single category
// @route   GET /api/v1/categories/:id
// @access  Public

exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id).populate('subjects');
        if (!category) {
            return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    POST category
// @route   POST /api/v1/categories
// @access  Public

exports.createCategory = asyncHandler(async (req, res, next) => {
    // validate input
    const { error } = validateCreateCategory(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    const { name, description } = req.body;

    let category = await Category.findOne({ name });
    if (category) return next(new ErrorResponse('Category with the name exists already', 400));

    category = new Category({ name, description });
    await category.save();

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
    });
});

// @desc    PUT category
// @route   PUT /api/v1/categories/:id
// @access  Private

exports.updateCategory = asyncHandler(async (req, res, next) => {
    // validate input
    const { error } = validateUpdateCategory(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    let category = await Category.findById(req.params.id);
    if (!category) {
        return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category,
    });
});

// @desc    DELETE category
// @route   DELETE /api/v1/categories/:id
// @access  Private

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
    }

    await category.remove();

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
        data: {},
    });
});
