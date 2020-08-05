const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const Bootcamp = require("./models/Bootcamp");

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

//Import data into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

//Delete data in the DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
