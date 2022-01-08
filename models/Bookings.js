const mongoose = require('mongoose');

const BookingsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'please add a subject you like'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        duration: {
            type: Number,
            required: [true, 'Please add duration'],
        },
        date: {
            type: Date,
            default: Date.now() + 10 * 60 * 1000,
            required: [true, 'Please add a date for the tutorial'],
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'canceled', 'finished', 'rejected'],
            default: 'pending',
        },
        amount: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        subject: {
            type: mongoose.Schema.ObjectId,
            ref: 'Subject',
            required: true,
        },
        student: {
            type: mongoose.Schema.ObjectId,
            ref: 'Student',
            required: true,
        },
        tutors: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Tutor',
                required: true,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Bookings', BookingsSchema);
