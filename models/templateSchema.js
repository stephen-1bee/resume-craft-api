const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
    default: null,
  },
  hasPhoto: {
    type: Boolean,
    require: true,
    default: false,
  },
  resume_id: {
    type: String,
    require: true,
    default: null,
  },
  color: {
    type: String,
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
module.exports = mongoose.model("templateSchema", templateSchema, "templates");
