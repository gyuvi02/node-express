const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name shouldn\'t be longer than 40 characters'],
    minlength: [10, 'A tour name shouldn\'t be shorter than 10 characters']
    // validate: [validator.isAlpha, 'Alphanumeric characters only']
  },

  slug: String,

  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },

  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },

  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty must be easy, medium or difficult'
    }
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5']
  },

  ratingsQuantity: {
    type: Number,
    default: 0
  },

  price: {
    type: Number,
    required: true
  },

  priceDiscount: {
    type: Number,
    validate: {
      validator:
        function(val){
          return val < this.price;
      },
      message: 'The discount price ({VALUE}) must be lower than the original price'
    }
  },

  summary: {
    type: String,
    trim: true,
    required: [true, "The tour must have a summary"]
  },

  description: {
    type: String,
    trim: true
  },

  imageCover: {
    type: String,
    required: [true, 'The tour must have an image']
  },

  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },

  startDates: [Date],

  secretTour: {
    type: Boolean,
    default: false
  },

  startLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
},
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  });

//Virtual populating
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: 'id'
})

// tourSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// })


//DOCUMENT MIDDLEWARE runs before .save() and .create() but not .insertMany
// tourSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// })
//
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// })

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: {$ne: true}})

  this.start = Date.now();
  next();
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  next();
})

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  });
  next();
});

//AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;