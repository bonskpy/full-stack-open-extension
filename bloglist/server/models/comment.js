const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

commentSchema.set("toJSON", {
  transform: (document, representation) => {
    representation.id = document._id;
    delete representation._id;
    delete representation.__v;
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
