const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema({
  photo: {
    type: String,
    require: true,
    default: null,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
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
  year_of_experience: {
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
    type: String,
    require: true,
    default: null,
  },
  current_work: {
    type: String,
    require: true,
    default: null,
  },
  skills: {
    type: [String],
    require: true,
    default: null,
  },
  program_of_study: {
    type: String,
    require: true,
    default: null,
  },
  yearOfEducation: {
    type: String,
    require: true,
    default: null,
  },
  nameOfInstitutoion: {
    type: String,
    require: true,
    default: null,
  },
  company: {
    type: String,
    require: true,
    default: null,
  },
  role: {
    type: String,
    require: true,
    default: null,
  },
  year_of_experice: {
    type: String,
    require: true,
    default: null,
  },
  reference: {
    type: String,
    require: true,
    default: null,
  },
  summary: {
    type: String,
    require: true,
    default: null,
  },
  year_of_experice: {
    type: String,
    require: true,
    default: null,
  },
  role: {
    type: String,
    require: true,
    default: null,
  },
  language: {
    type: [String],
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
})

module.exports = mongoose.model("resumeSchema", resumeSchema, "resumes")
