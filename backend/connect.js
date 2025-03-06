const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDb() {
  return mongoose.connect(process.env.DATABASE);
}

module.exports = connectToDb;
