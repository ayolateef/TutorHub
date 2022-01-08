const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Subject = require('../models/Subject');
const Category = require('../models/Category');
const { validateCreateSubject, validateUpdateSubject } = require('../validation/subject');

// @desc    GET all subjects
// @route   GET/api/v1/subjects
// @access  Public
exports.getSubjects = asyncHandler(async (req, res, next) => {
    // let query;
    // // check if the category exist
    // if (req.params.categoryId) {
    //     query = Subject.find({ category: req.params.categoryId });
    // } else {
    //     query = Subject.find().populate({
    //         path: 'category',
    //         select: 'name description',
    //     });
    // }
    // const subjects = await query;

    const subjects = await Subject.find({})
        .populate({ path: 'category', select: 'name description' })
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        message: 'Subjects retrieved successfully',
        count: subjects.length,
        data: subjects,
    });
});

// @desc    GET single subject
// @route   GET/api/v1/subjects/:id
// @access  Public

exports.getSubject = asyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.params.id).populate({
        path: 'category',
        select: 'name description',
    });
    if (!subject) {
        return next(new ErrorResponse(`No subject with the id of ${req.params.id}`), 404);
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
    const { error } = validateCreateSubject(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    // Get the category id submit to tve body
    req.body.category = req.params.categoryId;

    const { title, category } = req.body;

    const checkCategory = await Category.findById(req.params.categoryId);
    if (!checkCategory) {
        return next(new ErrorResponse(`No category with the id of ${req.params.categoryId}`), 404);
    }

    let subject = await Subject.findOne({ title, category });
    if (subject) return next(new ErrorResponse('Subject with the title exists under category', 400));

    // create a new subject
    subject = await Subject.create(req.body);

    res.status(200).json({
        success: true,
        message: 'Subject created successfully',
        data: subject,
    });
});

// @desc    Update subject
// @route   PUT /api/v1/subjects/:id
// @access  Private

exports.updateSubject = asyncHandler(async (req, res, next) => {
    const { error } = validateUpdateSubject(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    // Fetch subject
    let subject = await Subject.findById(req.params.id);
    if (!subject) {
        return next(new ErrorResponse(`No subject with the id of ${req.params.id}`), 404);
    }

    if (req.body.title && req.body.title !== subject.name) {
        const duplicateSubject = await Subject.findOne({
            title: req.body.title,
            category: subject.category,
        });
        if (duplicateSubject) return next(new ErrorResponse('Title exists under category already', 400));
    }

    //then update
    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: 'Subject updated successfully',
        data: subject,
    });
});

// @desc    Delete subject
// @route   DELETE/api/v1/subject/:id
// @access  Private
exports.deleteSubject = asyncHandler(async (req, res, next) => {
    // Fetch subject
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
        return next(new ErrorResponse(`No subject with the id of ${req.params.id}`), 404);
    }

    //then remove
    await subject.remove();

    res.status(200).json({
        success: true,
        message: 'Subject deleted successfully',
        data: {},
    });
});
