const express = require("express");
const router = express.Router();
const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

router.post("/create", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const doesExist = await userSchema.findOne({
      first_name,
      last_name,
      email,
    });

    if (doesExist) {
      return res.status(400).json({ msg: "user already exists" });
    }

    const newUser = new userSchema({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    const saved_user = await newUser.save();

    return saved_user
      ? res.status(200).json({
          msg: `Welcome ${email} you have successfully created your account`,
          saved_user,
        })
      : res.status(404).json({ msg: "failed to create user" });
  } catch (err) {
    console.log(err);
    res.statusCode(500).json({ msg: "internal server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const all_users = await userSchema.find();

    res
      .status(200)
      .json({ msg: "success", user_count: all_users.length, all_users });
  } catch (err) {
    console.log(err);
    res.statusCode(500).json({ msg: "internal server error" });
  }
});

router.get("/one/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ msg: "user id not found" });
    }

    const user = await userSchema.findOne({ _id: userId });

    res.status(200).json({ msg: "success", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ msg: "user id not found" });
    }

    const user = await userSchema.findByIdAndDelete(userId);

    return user
      ? res.status(200).json({ msg: "user deleted successfully", user })
      : res.status(500).json({ msg: "failed to delete user" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ msg: "user id not found" });
    }

    const { first_name, last_name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userSchema.updateOne(
      { _id: userId },
      {
        first_name,
        last_name,
        email,
        password: hashedPassword
      }
    );

    return user.modifiedCount === 1
      ? res.status(200).json({ msg: "user updated successfully", user })
      : res.status(404).json({ msg: "fialed to updated user" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

module.exports = router;
