const express = require("express");
const app = express();

const morgan = require("morgan");
const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorControllers");
const tourRouter = require("./routes/tourRoutes.");
const userRouter = require("./routes/userRoutes");

//1) MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log("Hello from the middleware 😊");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the server side", app: "Natours" });
});

//2) FUNCTIONALITY
//app.post('/', (req, res) => res.send('You can post to this endpoints...'));
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3) ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//4) START SERVER

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`
  // });
  // const err = new Error("Can't find ${req.originalUrl} on this server");
  // err.status = "fail";
  // err.statuscode = 404;
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// app.use((err, req, res, next) => {
//   console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,

//     error: process.env.NODE_ENV === "development" ? err : {}
//   });
// });

app.use(globalErrorHandler);
module.exports = app;
