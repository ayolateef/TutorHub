const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Roles = require('../utils/roles');

const TutorSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: [true, 'Please add a first name'],
        },
        last_name: {
            type: String,
            required: [true, 'Please add a last name'],
        },
        email: {
            type: String,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please add a valid email',
            ],
            unique: true,
        },
        phone: {
            type: String,
            required: false,
        },
        rate: {
            type: Number,
            required: true,
        },
        role: {
            type: String,
            default: Roles.TUTOR,
        },
        active: {
            type: Boolean,
            default: true,
        },
        password: {
            type: String,
            required: [true, 'Please password required'],
            minlength: 6,
            maxlength: 50,
            select: false,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        subjects: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Subject',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
TutorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
TutorSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
};
//Match tutor entered password to hashed password in database
TutorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generate hash password token
TutorSchema.methods.getResetPasswordToken = function () {
    // Genrate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('Tutor', TutorSchema);
