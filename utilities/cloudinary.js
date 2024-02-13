const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME | "drcbj6n0u",
  api_key: process.env.CLOUD_KEY | "438731783743847",
  api_secret: process.env.CLOUD_API_KEY | "zy9reIk_59gz4Ayqg8oSkJfDhCo",
});

module.exports = cloudinary;
