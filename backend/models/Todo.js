const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Please add a task description"],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  isDefault: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Todo", todoSchema);
