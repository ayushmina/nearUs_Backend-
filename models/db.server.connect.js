"use strict";

let mongoose = require("mongoose");
var url = "mongodb://localhost:27017/nearUs";
// var url ="mongodb+srv://tushar:seraphic1999@@cluster0.ur4vj.mongodb.net/sequeer?retryWrites=true&w=majority";
 
mongoose.connect(
  url,
  {
    //  useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  },
  (error) => {
    console.log("Mongo Url", url);
    console.log("connection error", error);
  }
);

let timestamps = require("mongoose-timestamp");

mongoose.plugin(timestamps, {
  createdAt: "created_at",
  updatedAt: "modified_at",
});

module.exports = mongoose;
