const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}).then(() => {
    console.log("Connected to Mongo Db")
});

//middleware
app.use(express());
app.use(helmet());
app.use(morgan("common"));

// app.get("/", (req, res) => {
//     res.send("welcome to homepage")
// })

// app.get("/users", (req, res) => {
//     res.send("welcome to user page")
// })

app.listen(8080, () => {
    console.log("backend is running")
});