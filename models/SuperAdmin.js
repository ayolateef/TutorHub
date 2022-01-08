const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Roles = require('../utils/roles');

const SuperAdminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please type in a username'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please add a valid email',
            ],
            unique: true,
        },
        role: {
            type: String,
            default: Roles.SUPER_ADMIN,
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
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
SuperAdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
SuperAdminSchema.methods.getSignedJwtToken = function () {
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
//Match user entered password to hashed password in database
SuperAdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generate hash password token
SuperAdminSchema.methods.getResetPasswordToken = function () {
    // Genrate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);
