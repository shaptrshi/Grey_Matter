const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const adminExist = await Admin.findOne({ email });

    if (!adminExist) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exist" });
    }

    if (adminExist && (await adminExist.matchPassword(password))) {
      res.status(200).json({
        success: true,
        _id: adminExist._id,
        email: adminExist.email,
        token: jwt.sign({ _id: adminExist._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        }),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid admin data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", error });
  }
};

const adminRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const adminExist = await Admin.find({ email });

    if (!adminExist) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exist" });
    }

    const admin = new Admin({ email, password });
    await admin.save();

    if (admin) {
      res.status(201).json({
        success: false,
        _id: admin._id,
        email: admin.email,
        token: jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        }),
      });
    } else {
      res.status(401);
      throw new Error("Invalid admin data");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { adminLogin, adminRegister };
