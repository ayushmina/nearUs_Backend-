"use strict";

let mongoose = require("./db.server.connect"),
  Schema = mongoose.Schema,
  _ = require("underscore");
//   config = require("../config.server");

var UserSchema = new Schema({
    phoneNumber: {
        type: String,
        trim: true,
      },
    countryCode: {
        type: String,
        trim: true,
      },
      firebaseUID: { type: String },
});

module.exports = mongoose.model("user", UserSchema);