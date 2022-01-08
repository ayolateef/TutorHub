const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'please add a subject you like'],
        },
        description: {
            type: String,
            required: false,
        },
        duration: {
            type: Number,
            required: [true, 'Please add duration'],
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Subject', SubjectSchema);
