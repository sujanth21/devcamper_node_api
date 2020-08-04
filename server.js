const express = require("express");
const dotenv = require("dotenv");

const bootcampsRouter = require("./routes/bootcamps");

//Load environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();

//Mount routers
app.use("/api/v1/bootcamps", bootcampsRouter);

//Listening Server
app.listen(process.env.PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
