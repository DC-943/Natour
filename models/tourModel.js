const mongoose = require("mongoose");

const slugify = require("slugify");

const validator = require("validator")

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour must have less or equal then 40 characters"],
      minlength: [10, "A tour must have less or equal then 10 characters"],
      // validate:[validator.isAlpha,"Tour name must only contain characters"]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a max group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must hav a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either:easy,medium, difficult ",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0 "],
      max: [5, "Rating must be below 5.0 "],
    },
    ratingQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, "a tour must have a price"] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price; //100<200
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
//document middleware:runs before .save() and .create() .insertMany
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre("save", function (next) {
  console.log("will save document");
  next();
});
// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });
//Query middleware
// tourSchema.pre("find",function(next))
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});
//AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline);
  next();
});
//console.log(process.env);
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
