const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
            unique: true,
            maxlength: [50, 'Name cannot be more than 50 character'],
        },
        slug: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
            maxlength: [500, 'Name cannot be more than 50 character'],
        },
        photo: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

// Create category slug from the name and save
CategorySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Cascade delete subjects when a category is deleted
// CategorySchema.pre('remove', async function (next) {
//     await this.model('Subject').deleteMany({category: this._id});
//     next();
// });

module.exports = mongoose.model('Category', CategorySchema);
