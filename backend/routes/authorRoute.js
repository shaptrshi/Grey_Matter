const express = require("express");
const { authorLogin, authorRegister } = require("../controller/authorController");
const upload = require("../middleware/upload")

const router = express.Router();

router.post("/login", upload.none(), authorLogin);
router.post("/register", upload.single("profilePhoto"), authorRegister);

module.exports = router;
