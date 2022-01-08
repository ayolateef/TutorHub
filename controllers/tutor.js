const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Tutor = require('../models/Tutor');
const Subject = require('../models/Subject');
const { validateUpdateTutor } = require('../validation/tutor');
const Roles = require('../utils/roles');

// @desc    GET all Tutors
// @route   GET/api/v1/tutor
// @access  Public
exports.getTutors = asyncHandler(async (req, res, next) => {
    const tutors = await Tutor.find({}).populate({
        path: 'subjects',
        select: 'title duration',
        populate: {
            path: 'category',
            select: 'name',
        },
    });

    res.status(200).json({
        success: true,
        message: 'Tutors retrieved successfully',
        count: tutors.length,
        data: tutors,
    });
});

//  @desc    Get a tutor
//   @route   GET /api/v1/tutor/:id
//   @access  private/tutor

exports.getTutor = asyncHandler(async (req, res, next) => {
    const tutor = await Tutor.findById(req.params.id).populate({
        path: 'subjects',
        select: 'title duration',
        populate: {
            path: 'category',
            select: 'name',
        },
    });
    if (!tutor) {
        return next(new ErrorResponse(`No admin with the id of ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        data: tutor,
    });
});

//  @desc   Update  tutor
//   @route   PUT /api/v1/tutors/:id
//   @access  private/tutor
exports.updateTutor = asyncHandler(async (req, res, next) => {
    const { error } = validateUpdateTutor(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    let tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
        return next(new ErrorResponse(`No tutor with the id of ${req.params.id}`), 404);
    }
    if (req.tutor.id !== tutor.id && req.user.role !== (Roles.SUPER_ADMIN || Roles.SUPER_ADMIN))
        return next(new ErrorResponse('Permission denied', 403));

    tutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: 'Tutor updated successfully',
        data: tutor,
    });
});

/**
 * @description Tutor register under a subject
 * @route POST /api/v1/tutors/subject/:id/register
 * @access private/tutor
 * */
exports.registerTutorToSubject = asyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return next(new ErrorResponse('Subject not found', 404));

    if (req.tutor.subjects.includes(req.params.id))
        return next(new ErrorResponse('Tutor registered for subject already', 400));

    const tutor = await Tutor.findByIdAndUpdate(
        req.tutor.id,
        {
            $push: {
                subjects: req.params.id,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).populate({
        path: 'subjects',
        select: 'title duration',
    });

    return res.status(200).json({
        success: true,
        message: 'Tutor registered for subject successfully',
        data: tutor,
    });
});

/**
 * @description Tutor register under a subject
 * @route POST /api/v1/tutors/subject/:id/unregister
 * @access private/tutor
 * */
exports.unRegisterTutorToSubject = asyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return next(new ErrorResponse('Subject not found', 404));

    if (!req.tutor.subjects.includes(req.params.id))
        return next(new ErrorResponse('Tutor not registered for this subject', 400));

    const tutor = await Tutor.findByIdAndUpdate(
        req.tutor.id,
        {
            $pull: {
                subjects: req.params.id,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).populate({
        path: 'subjects',
        select: 'title duration',
    });

    return res.status(200).json({
        success: true,
        message: 'Tutor registered for subject successfully',
        data: tutor,
    });
});
