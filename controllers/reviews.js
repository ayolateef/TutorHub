const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Category = require('../models/Category');

// @desc    GET  reviews
// @route   GET/api/v1/reviews
// @route   GET/api/v1/categorys/:categoryId/reviews
// @access  Public

exports.getReviews = asyncHandler(async (req, res, next) => {
    // check if the category exist
    if (req.params.categoryId) {
        const reviews = await Review.find({ category: req.params.categoryId });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    }
});

// @desc    GET single review
// @route   GET/api/v1/reviews
// @access  Public

exports.getReview = asyncHandler(async (req, res, next) => {
    // check if the category exist
    const review = await Review.findById(req.params.id).populate({
        path: 'category',
        select: 'name, description',
        strictPopulate: false,
    });
    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`), 404);
    }
    res.status(200).json({
        success: true,
        data: review,
    });
});

// @desc    Add review
// @route   POST/api/v1/category/:categoryId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    // Add review to req.body
    req.body.students = req.students.id;
    // Get the category id submit to tve body
    req.body.category = req.params.categoryId;

    const category = await Category.findById(req.params.categoryId);

    // check if it exist
    if (!category) {
        return next(new ErrorResponse(`No category with the id of ${req.params.categoryId}`), 404);
    }

    // create a new subject for review
    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review,
    });
});

// @desc    update review
// @route   PUT/api/v1/review/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
    }
    //Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not autorize to update review`, 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: review,
    });
});

// @desc    Delete review
// @route   DELETE/api/v1/review/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
    }
    //Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not autorize to update review`, 401));
    }

    await review.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});
