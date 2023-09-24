// const express = require("express");
// const app = express();
// const morgan = require("morgan");
// const helmet = require("helmet");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const userRoute = require("./routes/users");
// const authRoute = require("./routes/auth");

// dotenv.config()

// mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}).then(() => {
//     console.log("db connected")
// });

// //middleware
// app.use(express.json());
// app.use(helmet());
// app.use(morgan("common"));


// app.use("/api/users", userRoute);
// app.use("./api/auth", authRoute);

// app.listen(8080, () => {console.log("Backend is running")});

const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}).then(() => {
    console.log("Connected to Mongo Db")
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(8080, () => {
    console.log("backend is running")
});