const Admin = require("../models/Admin");
const {
  validateLogin,
  validateSuperAdminLogin,
} = require("../validation/authValidation");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Tutor = require("../models/Tutor");
const SuperAdmin = require("../models/SuperAdmin");
const Student = require("../models/Student");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.superadminLogin = asyncHandler(async (req, res, next) => {
  // 1. validate request
  const { error } = validateSuperAdminLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // 2. check if the superadmin exists in the database
  const superadmin = await SuperAdmin.findOne({
    username: req.body.username,
  }).select("password");
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
// @forgot password superadmin
exports.forgotSuperadminPassword = asyncHandler(async (req, res, next) => {
  const superadmin = await SuperAdmin.findOne({ username: req.body.username });

  if (!superadmin) {
    return next(new ErrorResponse("There is superadmin with username", 404));
  }
  //Get reset token
  const resetToken = superadmin.getResetPasswordToken();

  console.log(resetToken);
  await superadmin.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: superadmin.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    superadmin.resetPasswordToken = undefined;
    superadmin.resetPasswordExpire = undefined;

    await superadmin.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    data: superadmin
  });
});
//resetPassword SuperAdmin
// PUT /api/v1/auth/resetpassword/: resettoken

exports.resetSuperadminPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const superadmin = await SuperAdmin.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!superadmin) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  // Set new password 
  superadmin.password = req.body.password;
  superadmin.resetPasswordToken = undefined;
  superadmin.resetPasswordExpire = undefined;
  await superadmin.save();

  res.status(200).json({ success: true, data: superadmin });
});

// Admin Auth
exports.adminLogin = asyncHandler(async (req, res, next) => {
  // 1. validate request
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // 2. check if the admin exists in the database
  const admin = await Admin.findOne({ email: req.body.email }).select(
    "password"
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

// Admin forgot password
exports.forgotadminPassword = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return next(new ErrorResponse("There is admin with email", 404));
  }
  //Get reset token
  const resetToken = admin.getResetPasswordToken();

  await admin.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: admin.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    data: admin,
  });
});

//resetPassword Admin
// PUT /api/v1/auth/resetpassword/: resettoken

exports.resetAdminPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const admin = await Admin.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!admin) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  // Set new password 
  admin.password = req.body.password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;
  await admin.save();

  res.status(200).json({ success: true, data: admin });
});

// Tutor Auth 
exports.tutorLogin = asyncHandler(async (req, res, next) => {
  // 1. validate request
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // 2. check if the tutor exists in the database
  const tutor = await Tutor.findOne({ email: req.body.email }).select(
    "password"
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

// tutor forgot password
exports.forgotTutorPassword = asyncHandler(async (req, res, next) => {
  const tutor = await Tutor.findOne({ email: req.body.email });

  if (!tutor) {
    return next(new ErrorResponse("There is tutor with email", 404));
  }
  //Get reset token
  const resetToken = tutor.getResetPasswordToken();

  await tutor.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: tutor.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    tutor.resetPasswordToken = undefined;
    tutor.resetPasswordExpire = undefined;

    await tutor.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    data: tutor,
  });
});

//resetPassword Tutor
// PUT /api/v1/auth/resetpassword/: resettoken

exports.resetTutorPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const tutor = await Tutor.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!tutor) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  // Set new password 
  tutor.password = req.body.password;
  tutor.resetPasswordToken = undefined;
  tutor.resetPasswordExpire = undefined;
  await tutor.save();

  res.status(200).json({ success: true, data: tutor});
});

// STUDENT AUTH
exports.studentLogin = asyncHandler(async (req, res, next) => {
  // 1. validate request
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // 2. check if the tutor exists in the database

  const student = await Student.findOne({ email: req.body.email }).select(
    "password"
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

// Student forgot password
exports.forgotStudentPassword = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email });

  if (!student) {
    return next(new ErrorResponse("There is student with email", 404));
  }
  //Get reset token
  const resetToken = student.getResetPasswordToken();

  await student.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: student.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    student.resetPasswordToken = undefined;
    student.resetPasswordExpire = undefined;

    await student.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

//resetPassword Student
// PUT /api/v1/auth/resetpassword/: resettoken

exports.resetStudentPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const student = await Student.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!student) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  // Set new password 
  student.password = req.body.password;
  student.resetPasswordToken = undefined;
  student.resetPasswordExpire = undefined;
  await student.save();

  res.status(200).json({ success: true, data: student });
});
