// "use strict";

// const { users } = require("../models");

/**
 * Module dependencies.
 */
let 
// config = require("../config/config.server"),
jwt = require("jsonwebtoken"),
jwt_decode = require("jwt-decode");
let userModel = require('../models/user.model')


exports.hasAuthentcation = function (req, res, next) {
  return async (req, res, next) => {
    try {
      var token = req.headers["authorization"];
      // console.log("authnetication started");
      // console.log("in");
      if (token) {
        // console.log("token",token)
        let decoded = jwt_decode(token);
        if (decoded) {
          // try {
          let user = await userModel.findOne({
            firebaseUID: decoded.user_id,
          });
          // console.log("here u got user", user);
          if (!user) {
            res.status(403).json({
              success: false,
              message: "Oops!!! User not found.",
            });
          }
          if (user.suspended == true) {
            res.status(401).json({
              success: false,
              message: "Oops!!! User Suspended By Admin.",
            });
          }
          user = user.toJSON();
          let userInfo = {
            id: user._id,
            phoneNumber: user.phoneNumber ? user.phoneNumber : "",
            firebaseUserId: decoded.user_id,
          };
          req.user = userInfo;
          // console.log("user", userInfo);
          next();
          // } catch (error) {
          //   res.status(403).json({
          //     success: false,
          //     message: "error",
          //     data: error,
          //   });
          // }
        }
      } else {
        res.status(403).json({
          success: false,
          message: "No Token",
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};


