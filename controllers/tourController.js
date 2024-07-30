//const fs = require("fs");
const Tour = require("../models/tourModel");
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

exports.getAllTours = async (req, res) => {
  try {
    //build query
    //1A) Filtering
    console.log(req.query);

    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    //console.log(req.query, queryObj);

    //1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));
    //console.log(req.requestTime);
    //execute query

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      query = query.sort(sortBy);
      //sort('price ratingAverage')
    } else {
      query = query.sort("-createdAt");
    }

    const tours = await query;
    res.status(200).send({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id:req.params:id})
    res.status(200).send({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }

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
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: "success",
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   },
  // );
};
exports.updateTour = async (req, res) => {
  try {
    console.log(req.params.id, req.body);
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    // if (req.params.id * 1 > tour.length) {
    //   res.status(404).send({
    //     status: "fail",
    //     message: "Invalid ID",
    //   });
    // }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
