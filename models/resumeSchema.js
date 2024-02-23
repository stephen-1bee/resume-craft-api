const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  photo: {
    type: String,
    require: true,
    default: null,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    // type: String,
    require: true,
    default: null,
  },
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
  phone: {
    type: String,
    require: true,
    default: null,
  },
  address: {
    type: String,
    require: true,
    default: null,
  },
  level_of_education: {
    type: String,
    require: true,
    default: null,
  },
  country: {
    type: String,
    require: true,
    default: null,
  },
  previous_work: {
    type: Array,
    require: true,
    default: null,
  },
  current_work: {
    type: Array,
    require: true,
    default: null,
  },
  skills: {
    type: Array,
    require: true,
    default: null,
  },
  reference: {
    type: Array,
    require: true,
    default: null,
  },
  language: {
    type: Array,
    require: true,
    default: null,
  },
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("resumeSchema", resumeSchema, "resumes");
