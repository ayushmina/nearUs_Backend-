const router = require("express").Router();
const { route } = require(".");
var auth = require("../controller/user.authentication.server.controllers");

// Controllers
var users = require("../controller/users.server.controllers");

// admin pannel
router.route("/loginSignup").post(users.loginSignup);
router.route("/postJob").post(auth.hasAuthentcation(),users.postJob);
router.route("/ownJob").get(auth.hasAuthentcation(),users.ownJob);
router.route("/searchJobs").get(users.searchJobs);
router.route("/editPost/:jobId").post(auth.hasAuthentcation(),users.editJob);
router.route("/repost/:jobId").get(auth.hasAuthentcation(),users.repost);
router.route("/deletePost/:jobId").get(auth.hasAuthentcation(),users.deletePost);


module.exports = router;