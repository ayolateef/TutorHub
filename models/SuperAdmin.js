const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const SuperAdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please type in a username"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
      unique: true,
    },
    role: {
      type: String,
      default: "superAdmin",
    },
    active: Boolean,
    password: {
      type: String,
      required: [true, "Please password required"],
      minlength: 6,
      maxlength: 50,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
  function validateSuperAdmin(superadmin) {
    const schema = {
      username: Joi.string().min(5).max(50).required(),
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(superadmin, schema);
  }
);

// Encrypt password using bcrypt
SuperAdminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
SuperAdminSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
//Match user entered password to hashed password in database
SuperAdminSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
 
module.exports = mongoose.model("SuperAdmin", SuperAdminSchema);
