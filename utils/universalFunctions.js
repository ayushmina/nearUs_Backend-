let Boom = require("boom");
let Joi =require("joi");
let responseMessages= require("../resources/response.json");
let Https= require("https");
// let Config = require("config");


// import 'regenerator-runtime/runtime'
// var randomstring = require("randomstring");
const validateRequestPayload = async (requestObj, res, schema) => {
  return new Promise((resolve, reject) => {
    const { error } = Joi.validate(requestObj, schema);
    console.log(error,"hdbjhdbjhfjbdfvb")
    if (error) {
      let message = sendBadRequestError(error, res);
      reject(Boom.badRequest(message));
    } else {
      resolve();
    }
  });
};

const sendError = (data, res) => {
  let error;
  console.log("ERROR OCCURRED IN SEND ERROR FUNCTION", data);
  let message = null;
  if (typeof data == "object" && !data.isBoom) {
    if (data.name == "MongoError") {
      // Check Mongo Error
      message = responseMessages.DB_ERROR;
      if (data.code == 11000) {
        if (data.message.split(" ").indexOf("email_1") > -1) {
          const conflictError = Boom.conflict(
            responseMessages.EMAIL_ALREADY_EXISTS
          );
          return res.json(conflictError.output.payload);
        } else {
          message = responseMessages.DUPLICATE;
        }
      }
    } else if (data.name == "ApplicationError") {
      message = responseMessages.APP_ERROR;
    } else if (data.name == "ValidationError") {
      message = responseMessages.APP_ERROR;
    } else if (data.name == "CastError") {
      message = responseMessages.INVALID_OBJECT_ID;
    } else if (data.response) {
      message = data.response.message;
    } else if (data.message) {
      message = data.message;
    } else {
      message = responseMessages.DEFAULT;
    }
    if(data.statusCode === 427) {
      error = new Boom(message, {
        statusCode: data.statusCode,
      });
      return res.json(error.output.payload);
    }
    if (message !== null) {
      error = new Boom(message, {
        statusCode: 400,
      });
      return res.json(error.output.payload);
    }
  } else if (typeof data == "object" && data.isBoom) {
    if (data.data && data.data.code) {
      data.output.payload.code = data.data.code;
    }
    return res.json(data.output.payload);
  } else {
    error = new Boom(data, {
      statusCode: 400,
    });
    return res.json(error.output.payload);
  }
};

/*-------------------------------------------------------------------------------
 * send success
 * -----------------------------------------------------------------------------*/

const sendSuccess = (response, res) => {
  const statusCode =
    response && response.statusCode ? response.statusCode : 200;
  const message = response && response.message ? response.message : "Success";
  const data = response.data ? response.data : {};
  data.password && delete data.password;

  return res.json({
    statusCode,
    message,
    data,
  });
};

/*-------------------------------------------------------------------------------
 * Joi error handle
 * -----------------------------------------------------------------------------*/
const sendBadRequestError = (error, res) => {
  let message = error.details[0].message;
  message = message.replace(/"/g, "");
  message = message.replace("[", "");
  message = message.replace("]", "");

  return message;
};


/*-------------------------------------------------------------------------------
 * Distance And Time Get Api Using Google Matrix
 * -----------------------------------------------------------------------------*/
// const getDistanceBetweenTwoPoints = async (firstPointObj, secondPointObj) => {

//   return new Promise((resolve, reject) => {
//       try {
//           const googleApiKey = Config.get('googleApiKey')
//           Https.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${firstPointObj.latitude},${firstPointObj.longitude}&destinations=${secondPointObj.latitude},${secondPointObj.longitude}&key=${googleApiKey}`, (resp) => {
//               let data = ''
//               resp.on('data', (chunk) => {
//                   data += chunk;
//               });
//               resp.on('end', () => {
//                   resolve(JSON.parse(data))
//               });

//           }).on("error", (err) => {
//               reject(err)
//               console.log("Error: " + err.message);
//           })
//       } catch (error) {
//           throw error
//       }
//   })
// }



function generateFilenameWithExtension(oldFilename, newFilename) {
  var ext = oldFilename.substr((~-oldFilename.lastIndexOf(".") >>> 0) + 2);
  return newFilename + '.' + ext;
}
module.exports = {
  validateRequestPayload,
  sendSuccess,
  sendError,
  // getDistanceBetweenTwoPoints,
  // generateRandomString,
  generateFilenameWithExtension
};
