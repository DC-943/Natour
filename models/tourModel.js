const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a tour must have a name"],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, "a tour must have a price"] },
});

//console.log(process.env);
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
