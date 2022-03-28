let userModel = require("../models/user.model");

var crud = {
  loginSignup: async function (req, res) {
    try {
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
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },
};

module.exports = crud;
