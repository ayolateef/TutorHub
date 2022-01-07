const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const SuperAdmin = require('../models/SuperAdmin');
const Admin = require('../models/Admin');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');
const Roles = require('../utils/roles');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  //checking for the authorization headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // set token from bearer token in headers
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  //Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorize to access this routes', 401));
  }
  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // { id: '', role: '' }
    const role = decoded.role;

    switch(role) {
      case (Roles.SUPER_ADMIN):
        req.super_admin = await SuperAdmin.findById(decoded.id);
        req.user =  req.super_admin;
        break;
      case (Roles.ADMIN):
        req.admin = await Admin.findById(decoded.id);
        req.user = req.admin;
        break;
      case (Roles.TUTOR):
        req.tutor = await Tutor.findById(decoded.id);
        req.user = req.tutor;
        break;
      default:
        req.student = await Student.findById(decoded.id);
        req.user = req.student
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorize to access this routes', 401));
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role )) {
      return next(
        new ErrorResponse(
          `Role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};