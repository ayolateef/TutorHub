const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async')
const SuperAdmin = require("../models/SuperAdmin");

// @desc    POST create
// @route  POST/api/v1/superadmin/
// @access  Public

exports.createSuperadmin = asyncHandler(async (req, res, next) => {
    const superadmin = await SuperAdmin.create(req.body);
    res.status(201).json({ success: true, data: superadmin });
});
