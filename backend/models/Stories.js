const mongoose = require("mongoose");

const slide = new mongoose.Schema({
  heading: {
    type: String,
  },
  description: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  category: {
    type: String,
  },
});

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slides: [slide],
  },
  { timestamps: true }
);

const Stories = mongoose.model("stories", storySchema);
module.exports = Stories;
