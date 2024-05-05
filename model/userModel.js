const e = require("express");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["CREATOR", "VIEWER", "VIEW_ALL"],
      default: "VIEWER",
      required: true,
    },
  }  );

module.exports = mongoose.model("User", userSchema);
