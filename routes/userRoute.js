const express = require("express")
const router = express.Router()
const userSchema = require("../models/userSchema")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const { check, validationResult } = require("express-validator")

router.post(
  "/create",
  [
    check("email")
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .withMessage("Please provide a valid email format."),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters long.")
      .matches(/[a-zA-Z]/)
      .withMessage("Password should contain at least one letter.")
      .matches(/\d/)
      .withMessage("Password should contain at least one numeric digit."),
  ],
  async (req, res) => {
    try {
      const { first_name, last_name, email, resume_id, password } = req.body

      const errors = validationResult(req)

      const hashedPassword = await bcrypt.hash(password, 10)

      if (errors.isEmpty()) {
        const error = errors.array().map((err) => err.msg)
        res.status(402).json({ msg: error })
      }

      const doesExist = await userSchema.findOne({
        first_name,
        last_name,
        email,
        password,
      })

      if (doesExist) {
        return res.status(400).json({ msg: "user already exist" })
      }

      const newUser = new userSchema({
        first_name,
        last_name,
        email,
        resume_id,
        password: hashedPassword,
      })

      const saved_user = await newUser.save()

      return saved_user
        ? res.status(200).json({
            msg: `Welcome , you have successfully created your account`,
            saved_user,
          })
        : res.status(404).json({ msg: "failed to create user" })
    } catch (err) {
      console.log(err)
      res.statusCode(500).json({ msg: "internal server error" })
    }
  }
)

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userSchema.findOne({ email })

    if (!user) {
      return res.status(400).json({ msg: `${email} does not exist` })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      return res.status(401).json({ msg: "incorrect password" })
    }

    res
      .status(200)
      .json({ msg: `Welcome , you have successfully logged in`, user })
  } catch (err) {
    console.log(err)
    resstatus(500).json({ msg: "internal server error" })
  }
})

router.get("/all", async (req, res) => {
  try {
    const all_users = await userSchema.find()

    res
      .status(200)
      .json({ msg: "success", user_count: all_users.length, all_users })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

router.get("/one/:id", async (req, res) => {
  try {
    const userId = req.params.id

    if (!userId) {
      return res.status(400).json({ msg: "user id not found" })
    }

    const user = await userSchema.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "resumes",
          localField: "resume_id",
          foreignField: "_id",
          as: "resume",
        },
      },
    ])

    return user
      ? res.status(200).json({ msg: "success", user })
      : res.status(404).json({ msg: "failed to find single user" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

router.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ msg: "user id not found" })
    }

    const user = await userSchema.findByIdAndDelete(userId)

    return user
      ? res.status(200).json({ msg: "user deleted successfully", user })
      : res.status(500).json({ msg: "failed to delete user" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

router.put("/update/:id", async (req, res) => {
  try {
    const userId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ msg: "user id not found" })
    }

    const { first_name, last_name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userSchema.updateOne(
      { _id: userId },
      {
        first_name,
        last_name,
        email,
        password: hashedPassword,
      }
    )

    return user.modifiedCount === 1
      ? res.status(200).json({ msg: "user updated successfully", user })
      : res.status(404).json({ msg: "fialed to updated user" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

// recover email
router.post("/recovery", async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body

    const user = await userSchema.findOne({ email })

    if (password !== confirm_password) {
      return res.status(400).json({ msg: "password do not match" })
    }

    if (!user) {
      return res.status(400).json({ msg: `${email} email is not a valid user` })
    }

    const currentUser = user.id

    const hashedPassword = await bcrypt.hash(password, 10)

    const updateUserPassword = await userSchema.updateOne(
      { _id: currentUser },
      { $set: { password: hashedPassword } }
    )

    if (updateUserPassword.modifiedCount === 1) {
      res.json({ msg: "password recovered successfully", updateUserPassword })
    } else {
      res.json({ msg: "failed to recover password" })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

module.exports = router
