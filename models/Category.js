const mongoose = require ('mongoose');
const slugify = require("slugify");


   const CategorySchema = new mongoose.Schema({ 
       name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        unique: true,
        maxlength:[50, 'Name cannot be more than 50 character'],

       },
       slug: String,
       description:{
        type: String,
        required: [true, 'Please add a description'],
        unique: true,
        maxlength:[500, 'Name cannot be more than 50 character']
       },
       website: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          "Please use a valid URL with Https",
        ],
      },
      email: {
        type: String,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please add a valid email",
        ],
      },
       photo: {
        type: String,
        default: "no-photo.jpg",
      },
     
    },
   {timestamps: true}
    );

    // Create category slug from the name and save
    CategorySchema.pre('save', function(next) {
     this.slug = slugify(this.name,{lower: true})
      next();
    });

    module.exports =  mongoose.model("Category", CategorySchema) 