const mongoose = require("mongoose");

const new_mongoose = new mongoose.Schema({
  content: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blogPost",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const comment = mongoose.model("comment", new_mongoose);
module.exports = comment;
