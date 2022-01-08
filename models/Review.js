const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'please add a title for the review'],
            maxlength: 100,
        },
        text: {
            type: String,
            required: [true, 'Please add some text'],
        },
        duration: {
            type: Number,
            required: [true, 'Please add duration'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please add a rating between 1 and 5'],
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
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

//prevent student from submitting more than one review percategory
ReviewSchema.index({ category: 1, tutor: 1, student: 1 }, { unique: true });

//Static method to get avg of rating and save
ReviewSchema.statics.getAverageRating = async function (categoryId) {
    const obj = await this.aggregate([
        {
            $match: { category: categoryId },
        },
        {
            $group: {
                _id: '$category',
                averageRating: { $avg: '$rating' },
            },
        },
    ]);

    try {
        await this.model('Category').findByIdAndUpdate(categoryId, {
            averageRating: obj[0].averageRating,
        });
    } catch (err) {
        console.error(err);
    }
};
// Call getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.category);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.category);
});

module.exports = mongoose.model('Review', ReviewSchema);
