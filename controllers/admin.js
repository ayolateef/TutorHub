const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Admin = require('../models/Admin');
const { validateAdmin, validateUpdateAdmin } = require('../validation/admin');
const Roles = require('../utils/roles');

const DEFAULT_PASSWORD = '!qjhe7303m39';

// @desc    Create an Admin
// @route   POST/api/v1/admins
// @access  Public
exports.createAdmin = asyncHandler(async (req, res, next) => {
    // validate input
    const { error } = validateAdmin(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    const { first_name, last_name, email, username } = req.body;

    let admin = await Admin.findOne({ username, email });
    if (admin) return next(new ErrorResponse('Admin exists already', 400));

    admin = new Admin({
        first_name,
        last_name,
        email,
        username,
        password: DEFAULT_PASSWORD,
    });

    await admin.save();

    // TODO: initiate admin password reset and send email to admin
    const token = await admin.getResetPasswordToken();

    // TODO: send token to admin email to reset password

    res.status(201).json({
        success: true,
        message: 'Admin added successfully',
        data: admin,
    });
});

// @desc    GET all Admins
// @route   GET/api/v1/admins
// @access  Private/superadmin
exports.getAdmins = asyncHandler(async (req, res, next) => {
    const admins = await Admin.find({});

    res.status(200).json({
        success: true,
        count: admins.length,
        data: admins,
    });
});

// @desc    GET  admin by id
// @route   GET/api/v1/admins/:id
// @access  Private/superadmin
exports.getAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return next(new ErrorResponse('Admin not found', 404));

    return res.status(200).json({
        success: true,
        message: 'Admin retrieved successfully',
        data: admin,
    });
});

// @desc    Deactivate admin
// @route   PUT /api/v1/admins/:id/deactivate
// @access  Private/superadmin
exports.deactivateAdmin = asyncHandler(async (req, res, next) => {
    let admin = await Admin.findById(req.params.id);
    if (!admin) return next(new ErrorResponse('Admin not found', 404));

    admin = await Admin.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                active: false,
            },
        },
        {
            new: true,
            runValidators: false,
        }
    );

    return res.status(200).json({
        success: true,
        message: 'Admin deactivated successfully',
        data: admin,
    });
});

// @desc    Activate admin
// @route   PUT /api/v1/admins/:id/activate
// @access  Private/superadmin
exports.activateAdmin = asyncHandler(async (req, res, next) => {
    let admin = await Admin.findById(req.params.id);
    if (!admin) return next(new ErrorResponse('Admin not found', 404));

    admin = await Admin.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                active: true,
            },
        },
        {
            new: true,
            runValidators: false,
        }
    );

    return res.status(200).json({
        success: true,
        message: 'Admin activated successfully',
        data: admin,
    });
});

//  @desc    Get single admin
//   @route   GET /api/v1/admin/:id
//   @access  private/superadmin

exports.getAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id).populate({
        path: 'subjects',
        select: 'title',
        strictPopulate: false,
    });
    if (!admin) {
        return next(new ErrorResponse(`No admin with the id of ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        data: admin,
    });
});

// @desc   Update Admin
// @route   PUT/api/v1/auth/admin/:id
// @access  Private/admin
exports.updateAdmin = asyncHandler(async (req, res, next) => {
    // validate input
    const { error } = validateUpdateAdmin(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message, 400));

    // 403 --> Forbidden
    if (req.admin.id !== req.params.id && req.user.role !== Roles.SUPER_ADMIN)
        return next(new ErrorResponse('Permission denied', 403));

    let admin = await Admin.findById(req.params.id);
    if (!admin) return next(new ErrorResponse('Admin not found', 404));

    admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });

    return res.status(200).json({
        success: true,
        message: 'Admin updated successfully',
        data: admin,
    });
});
