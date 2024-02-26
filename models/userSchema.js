const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    require: true,
    default: null,
  },
  last_name: {
    type: String,
    require: true,
    default: null,
  },
  email: {
    type: String,
    require: true,
    default: null,
  },
  password: {
    type: String,
    require: true,
    default: null,
  },
  confirm_password: {
    type: String,
    require: true,
    default: null,
  },
  resume_id: {
    type: mongoose.Types.ObjectId,
    require: true,
    default: null,
  },
  dateUpdated: {
    type: Date,
    require: true,
    default: new Date(),
  },
  dateCreated: {
    type: Date,
    require: true,
    default: new Date(),
  },
});

module.exports = mongoose.model("userSchema", userSchema, "users");
