//const fs = require("fs");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(404)
//       .send({ status: "fail", message: "Missing name or price" });
//   }
//   next();
// };

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is:${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).send({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };

exports.getAllTours = catchAsync(async (req, res, next) => {
  // try {
  //build query
  //1A) Filtering
  console.log(req.query);

  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).send({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "fail",
  //     message: error.message
  //   });
  // }
});

exports.getTour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findById(req.params.id);
  //Tour.findOne({_id:req.params:id})
  if (!tour) {
    return next(new AppError("No tour found with that ID"));
  }

  res.status(200).send({
    status: "success",
    data: {
      tour
    }
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "fail",
  //     message: err
  //   });
});

// console.log(req.params);
// const id = req.params.id * 1;
// const tour = tours.filter((el) => el.id === id);
// if (id > tours.length || !tour) {
//   res.status(404).send({
//     status: "fail",
//     message: "Invalid ID",
//   });
//
// res.status(200).send({
//   status: "success",
//   data: {
//     tour,
//   },
// });
// };

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // try {
  console.log(req.params.id, req.body);
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new AppError("No tour found with that ID"));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "fail",
  //     message: err.message
  //   });
  // }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with that ID"));
  }

  // if (req.params.id * 1 > tour.length) {
  //   res.status(404).send({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }
  res.status(204).json({
    status: "success",
    data: null
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "fail",
  //     message: err.message
  //   });
  // }
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        avgRating: { $avg: "$ratingsAverage" },
        maxPrice: { $max: "$price" }
      }
    },

    {
      $sort: { avgPrice: 1 }
    }
    //   {
    //     $match: { _id: { $ne: "EASY" } },
    //   },
  ]);

  res.status(200).json({
    status: "success",
    data: { stats }
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "fail",
  //     message: err.message
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates"
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numToursStarts: { $sum: 1 },
        tours: { $push: "$name" }
      }
    },
    {
      $addFields: { month: "$_id" }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numToursStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: "success",
    data: { plan }
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "fail",
  //     message: err.message
  //   });
  // }
});
