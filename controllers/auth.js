const Admin = require("../models/Admin");
const { validateLogin, validateSuperAdminLogin} = require("../validation/authValidation");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Tutor = require("../models/Tutor");
const SuperAdmin = require("../models/SuperAdmin");
const Student = require("../models/Student");

// const joi = {
//     error: {
//         details: [
//             {
//                 message: "email is required"
//             }
//         ]
//     }
// }

// {
//     email: "ajaomahmud@gmail.com",
//     password: "123456"
// }
exports.superadminLogin = asyncHandler(async (req, res, next) => {
  // 1. validate request
  const { error } = validateSuperAdminLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // 2. check if the superadmin exists in the database
  const superadmin = await SuperAdmin.findOne({
    username: req.body.username,
  }).select("+password");
  if (!superadmin)
    return next(new ErrorResponse("Invalid username or password", 400));

  //3. check if the superadmin password is correct
  const isPassword = await superadmin.matchPassword(req.body.password);
  if (!isPassword)
    return next(new ErrorResponse("Invalid username or password", 400));

  //4. Generate a token for the super admin
  const token = await superadmin.getSignedJwtToken();
  return res.status(200).json({ success: true, data: token });
});

exports.adminLogin = asyncHandler(async (req, res, next) => {
  // 1. validate request
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // 2. check if the admin exists in the database
  const admin = await Admin.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!admin) return next(new ErrorResponse("Invalid email or password", 400));

  //3. check if the admin password is correct
  const isPassword = await admin.matchPassword(req.body.password);
  if (!isPassword)
    return next(new ErrorResponse("Invalid email or password", 400));

  //4. check if the admin account has been deactivated
  if (!admin.active)
    return next(
      new ErrorResponse("Account deactivated, permission denied", 403)
    );

  //5. Generate a token for the admin
  const token = await admin.getSignedJwtToken();
  return res.status(200).json({ success: true, data: token });
});

exports.tutorLogin = asyncHandler(async (req, res, next) => {
  // 1. validate request
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // 2. check if the tutor exists in the database
  const tutor = await Tutor.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!tutor) return next(new ErrorResponse("Invalid email or password", 400));

  //3. check if the admin password is correct
  const isPassword = await tutor.matchPassword(req.body.password);
  if (!isPassword)
    return next(new ErrorResponse("Invalid email or password", 400));

  //4. check if the tutor account has been deactivated
  if (!tutor.active)
    return next(
      new ErrorResponse("Account deactivated, permission denied", 403)
    );

  //5. Generate a token for the tutor
  const token = await tutor.getSignedJwtToken();
  return res.status(200).json({ success: true, data: token });
});

exports.studentLogin = asyncHandler(async (req, res, next) => {
  // 1. validate request
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // 2. check if the tutor exists in the database
  // const superadmin = await SuperAdmin.findOne({ username }).select("+password");=
  const student = await Student.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!student)
    return next(new ErrorResponse("Invalid email or password", 400));

  //3. check if the student password is correct
  const isPassword = await student.matchPassword(req.body.password);
  if (!isPassword)
    return next(new ErrorResponse("Invalid email or password", 400));

  //4. Generate a token for the student
  const token = await student.getSignedJwtToken();
  return res.status(200).json({ success: true, data: token });
});
