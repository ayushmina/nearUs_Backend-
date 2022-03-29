let userModel = require("../models/user.model");
let jwt= require("jsonwebtoken")
let universalFunctions =require("../utils/universalFunctions");
var Joi  =require("joi");
const jobsModel = require("../models/jobs.model");
var crud = {
  loginSignup: async function (req, res) {
    try {
      console.log(req.body)
      const schema = Joi.object().keys({
        phoneNumber: Joi.string().trim().required(),
        firebaseUID: Joi.string().required(),
      });
      await universalFunctions.validateRequestPayload(req.body, res, schema);

      let body = req.body;
      let isExist = await userModel.findOne({
        firebaseUID: body.firebaseUID,
      });
      if (isExist) {
        var token = jwt.sign(
          {
            data: isExist._id,
          },
          "P16s2vsj6BRyFUKomxXG",
          {
            expiresIn: 15552000, // in seconds
          }
        );
        isExist = JSON.parse(JSON.stringify(isExist));

        delete isExist["modified_at"];
        delete isExist["created_at"];
        delete isExist["__v"];
        isExist.token = token;

        (isExist.newUserCreated = false),
          res.status(200).send({
            success: true,
            data: isExist,
          });
      } else {
        let createNew = await userModel.create(body);
        var token = jwt.sign(
          {
            data: createNew._id,
          },
          "P16s2vsj6BRyFUKomxXG",
          {
            expiresIn: 15552000, // in seconds
          }
        );
        createNew = JSON.parse(JSON.stringify(createNew));
        delete createNew["modified_at"];
        delete createNew["created_at"];
        delete createNew["__v"];
        delete createNew["salt"];
        delete createNew["created_at"];
        delete createNew["isDeleted"];
        delete createNew["password"];
        createNew.token = token;

        (createNew.newUserCreated = true),
          res.status(200).send({
            success: true,
            data: createNew,
          });
      }
    } catch (error) {
      console.log(error,"here is erroe ")
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },
  postJob: async function (req, res) {
    try {
      const schema = Joi.object().keys({
        contactName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        emailAddress: Joi.string().required(),
        businessName: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        zipcode: Joi.string().required(),
        experience: Joi.string().required(),
        jobType: Joi.string().required(),
        salary: Joi.number().required(),
        salaryPer: Joi.string().required(),
        comment: Joi.string().required(),

      });
      await universalFunctions.validateRequestPayload(req.body, res, schema);

      let body = req.body;
      let user = req.user;
      body.postedBy = user.id;

      let createJob = await jobsModel.create(body);

          res.status(200).send({
            success: true,
            data: createJob,
          });
    
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },
};

module.exports = crud;
