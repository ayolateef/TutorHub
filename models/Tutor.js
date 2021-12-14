const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const TutorSchema = new mongoose.Schema(
  {
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
      default: "Tutor",
    },
    active: { type: Boolean, defaultValue: true },
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
  {
    subject: {
      type: mongoose.Schema.ObjectId,
      ref: 'Subject',
      required: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
},
  },
  function validateTutor(tutor) {
    const schema = {
     
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(tutor, schema);
  }
);

// Encrypt password using bcrypt
TutorSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
TutorSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
//Match tutor entered password to hashed password in database
TutorSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
 
module.exports = mongoose.model("Tutor", TutorSchema);