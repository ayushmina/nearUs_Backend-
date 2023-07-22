"use strict";

let mongoose = require("./db.server.connect"),
  Schema = mongoose.Schema,
  _ = require("underscore");
//   config = require("../config.server");

var ApplySchema = new Schema({

    postid:{type: Schema.ObjectId, ref: "jobs"},
    salary:{type: String,trim: true},
    phone:{type: String,trim: true},    
    email:{type: String,trim: true},
    proposal:{type: String,trim: true},
    name:{type: String,trim: true},
    
});

module.exports = mongoose.model("apply", ApplySchema);