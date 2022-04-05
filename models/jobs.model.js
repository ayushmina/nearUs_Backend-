"use strict";

let mongoose = require("./db.server.connect"),
  Schema = mongoose.Schema,
  _ = require("underscore");
//   config = require("../config.server");

var JobSchema = new Schema({

    postedBy:{type: Schema.ObjectId, ref: "user"},
    jobTitle:{type: String,trim: true},
    contactName:{type: String,trim: true},
    phoneNumber:{type: String,trim: true},
    emailAddress:{type: String,trim: true},

    businessName: {type: String,trim: true},
    state: {type: String,trim: true},
    city: {type: String,trim: true},
    zipcode: {type: String,trim: true},

    experience: {type: String,trim: true},
    jobType: {type: String,trim: true},
    salary: {type: Number,trim: true},
    salaryPer: {type: String,trim: true},
    comment: {type: String,trim: true},

    industry: {type: String,trim: true},

});

JobSchema.index({ zipcode: "text" }) ;
JobSchema.index({ state: "text" });
JobSchema.index({ city: "text" });

module.exports = mongoose.model("jobs", JobSchema);