const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  storyId: {
    type: String,
  },
  userId: {
    type: String,
  },
  bookmark: [String],
  like: [String],
});

const Data = mongoose.model("data", dataSchema);
module.exports = Data;
