const mongoose = require("mongoose");

const new_mongoose = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  images: [{
    type: String,
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const blogPost = mongoose.model("blogPost", new_mongoose);
module.exports = blogPost;
