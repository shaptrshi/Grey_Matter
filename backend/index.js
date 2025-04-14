const express = require("express");
const dotenv = require("dotenv");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const articleRoute = require("./routes/articleRoute");
const cors = require("cors");
const connectDb = require("./config/db");
const path = require("path");

const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

connectDb();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to Blog");
});

app.use("/api/admin", adminRoute);
app.use("/api/articles", articleRoute);
app.use("/api/users", userRoute);

app.listen(port, () => {
  console.log(`Server is listening at port number ${port}`);
});
