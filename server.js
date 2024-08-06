const mongoose = require("mongoose");
// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

const dotenv = require("dotenv");
process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
// {
//  useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: true ,
// }
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // console.log(con.connections);
    console.log("DB connection successful");
  });

// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "a tour must have a name"],
//     unique: true,
//   },
//   rating: { type: Number, default: 4.5 },
//   price: { type: Number, required: [true, "a tour must have a price"] },
// });

// //console.log(process.env);
// const Tour = mongoose.model("Tour", tourSchema);

// const testTour = new Tour({
//   name: "The Park Camper Tour",
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log("ERROR🎇:", err);
//   });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
