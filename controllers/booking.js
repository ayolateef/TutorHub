const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bookings = require('../models/Bookings');

// @desc    GET all bookings
// @route   GET/api/v1/bookings
// @access  Public

exports.getBookings = asyncHandler(async (req, res, next) => {
    // Add admin to req.body

    const bookings = await Bookings.find();

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

// @desc    GET a single booking
// @route   GET/api/v1/booking/:id
// @access  Public

exports.getBooking = asyncHandler(async (req, res, next) => {
    const bookings = await Bookings.findById(req.params.body).populate({
        path: 'tutor student',
        select: 'name email',
        strictPopulate: false,
    });

    if (!bookings) {
        return next(new ErrorResponse(`No booking with the id of ${req.params.id}`), 404);
    }

    res.status(200).json({
        succes: true,
        data: bookings,
    });
});

// @desc   Add booking booking
// @route   POST/api/v1/booking/:id
// @access  Public

exports.createBooking = asyncHandler(async (req, res, next) => {
    req.body.tutor = req.tutor.id;
    req.body.students = req.students.id;
});
