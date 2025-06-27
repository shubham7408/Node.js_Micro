const expreess = require("express");
const router = expreess.Router();
const { registerUser } = require("../controller/identity_Controller.js");

router.post("/register", registerUser);

module.exports = router;
