const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//Load environment variables
dotenv.config({ path: "./config/config.env" });

const bootcampsRouter = require("./routes/bootcamps");
const coursesRouter = require("./routes/courses");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const reviewRouter = require("./routes/reviews");

connectDB();

const app = express();

//Body parser
app.use(express.json());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Cookie Parser
app.use(cookieParser());

//Middlewares
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File uploading
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Enable CORS
app.use(cors());

//Rate limitting
const limitter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limitter);

//Prevent http param polution
app.use(hpp);

//Mount routers
app.use("/api/v1/bootcamps", bootcampsRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(errorHandler);

//Listening Server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  );
});

//Handled unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit process
  server.close(() => process.exit(1));
});
