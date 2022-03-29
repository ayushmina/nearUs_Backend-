const router = require("express").Router();
const { route } = require(".");
var auth = require("../controller/user.authentication.server.controllers");

// Controllers
var users = require("../controller/users.server.controllers");

// admin pannel
router.route("/loginSignup").post(users.loginSignup);
router.route("/addPost").post(users.loginSignup);

module.exports = router;