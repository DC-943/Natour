class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    //console.log(req.query, queryObj);
    //1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
      //sort('price ratingAverage')
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // 3) Field limiting
    if (this.queryString.field) {
      const field = this.queryString.fields.split(",").join("");
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    //4) pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    //  if (this.queryString.page) {
    //    const numTours = await Tour.countDocuments();
    //    if (skip >= numTours) {
    //      throw new Error("This page does not exists");
    //    }
    //  }
    return this;
  }
}

module.exports = APIFeatures;
