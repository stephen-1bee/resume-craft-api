const mongoose = require("mongoose");

const con = async () => {
  try {
    await mongoose.connect(process.env.DEV_DB);
    console.log(`dev db established`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = con;
