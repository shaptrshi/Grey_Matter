const express = require("express");
const dotenv = require("dotenv");
const adminRoute = require("./routes/adminRoute");
const cors = require("cors");
const connectDb = require("./config/db");

const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Blog");
});

app.use("/api/admin", adminRoute);

app.listen(port, () => {
  console.log(`Server is listening at port number ${port}`);
});
