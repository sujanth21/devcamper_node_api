const express = require("express");
const dotenv = require("dotenv");

//Load environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
