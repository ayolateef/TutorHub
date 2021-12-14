const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      unique: true,
      maxlength: [50, "Name cannot be more than 50 character"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      unique: true,
      maxlength: [500, "Name cannot be more than 50 character"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with Https",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    subject: {
      type: mongoose.Schema.ObjectId,
    ref: 'Subject',
    required: true
    },
  }, 
  { timestamps: true },
  {toJSON: {virtuals: true},
  toObject: {virtuals: true }
 }
);

// Create category slug from the name and save
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete subjects when a category is deleted
CategorySchema.pre('remove', async function (next) {
  await this.model('Subject').deleteMany({category: this._id});
  next();
});


module.exports = mongoose.model("Category", CategorySchema)

