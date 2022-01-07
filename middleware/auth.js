const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const SuperAdmin = require("../models/SuperAdmin");
const Admin = require("../models/Admin");
const Tutor = require("../models/Tutor");
const Student = require("../models/Student");

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  //checking for the authorization headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // set token from bearer token in headers
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  //Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorize to access this routes", 401));
  }
  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.superadmin = await SuperAdmin.findById(decoded.id);
    req.admin = await Admin.findById(decoded.id);
    req.tutor = await Tutor.findById(decoded.id);
    req.student = await Student.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorize to access this routes", 401));
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.superadmin.role )) {
      return next(
        new ErrorResponse(
          `Role ${req.superadmin.role} is not authorized to access this route`,
          403
        )
      );
    }
    else if (!roles.includes(req.admin.role )) {
      return next(
        new ErrorResponse(
          `Role ${req.admin.role} is not authorized to access this route`,
          403
        )
      );
    }
    else if (!roles.includes(req.tutor.role )) {
      return next(
        new ErrorResponse(
          `Role ${req.tutor.role} is not authorized to access this route`,
          403
        )
      );
    }
    else if (!roles.includes(req.student.role )){
      return next(
        new ErrorResponse(
          `Role ${req.student.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};