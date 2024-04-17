const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const resumeSchema = require("../models/resumeSchema")
const cloudinary = require("../utilities/cloudinary")
const upload = require("../middleware/multer")
const { check, validationResult } = require("express-validator")

router.post(
  "/create",
  // [
  //   check("email")
  //     .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  //     .withMessage("Please provide a valid email format."),
  //   check("phone").custom((value, { req }) => {
  //     // Check if the phone number starts with 0 and has 10 digits
  //     if (!value.match(/^0\d{9}$/)) {
  //       throw new Error(
  //         "Invalid phone number. Phone number should be 10 digits"
  //       )
  //     }

  //     return true
  //   }),
  // ],
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        user_id,
        first_name,
        last_name,
        email,
        phone,
        level_of_education,
        country,
        previous_work,
        current_work,
        skills,
        reference,
        language,
        role,
        company,
        nameOfInstitutoion,
        address,
        yearOfEducation,
        program_of_study,
        year_of_experience,
        template_id,
        summary,
      } = req.body

      let photo

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const error = errors.array().map((err) => err.msg)
        res.status(401).json({ msg: error[0] })
      }

      // if (req.file) {
      //   photo = (await cloudinary.uploader.upload(req.file.path)).secure_url
      // }

      if (req.file) {
        photo = req.file.filename
      }

      //   const resumeExist = await resumeSchema.findOne({})

      const newResume = new resumeSchema({
        photo,
        user_id,
        first_name,
        last_name,
        email,
        phone,
        level_of_education,
        country,
        previous_work,
        current_work,
        skills,
        reference,
        language,
        role,
        company,
        nameOfInstitutoion,
        address,
        yearOfEducation,
        program_of_study,
        year_of_experience,
        template_id,
        summary,
      })

      const saved_resume = await newResume.save()

      return saved_resume
        ? res
            .status(200)
            .json({ msg: "resume created succesfully", saved_resume })
        : res.status(404).json({ msg: "fialed to create resume" })
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: "internal server error" })
    }
  }
)

router.get("/all", async (req, res) => {
  try {
    const all_resume = await resumeSchema.find().sort({ dateCreated: -1 })

    res.status(200).json({
      msg: "success",
      resume_count: all_resume.length,
      all_resume,
    })
  } catch (err) {
    console.log(err)
    res.statusCode(500).json({ msg: "internal server error" })
  }
})

// single resume
router.get("/one/:id", async (req, res) => {
  try {
    const resumeId = req.params.id

    if (!resumeId) {
      return res.status(400).json({ msg: "resume id not found" })
    }

    const resume = await resumeSchema.findOne({ _id: resumeId })

    res.status(200).json({ msg: "success", resume })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

router.delete("/delete/:id", async (req, res) => {
  try {
    const resumeId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      res.status(400).json({ msg: "user id not found" })
    }

    const resume = await resumeSchema.findByIdAndDelete(resumeId)

    return resume
      ? res.status(200).json({ msg: "resumer deleted successfully", resume })
      : res.status(500).json({ msg: "failed to delete resumer" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

router.put("/update/:id", upload.single("photo"), async (req, res) => {
  try {
    const resumeId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ msg: "resume id not found" })
    }

    const resume = await resumeSchema.findOne({ _id: resumeId })
    const currentPhoto = resume.photo

    const {
      user_id,
      first_name,
      last_name,
      email,
      phone,
      address,
      country,
      previous_work,
      current_work,
      skills,
      reference,
      language,
      template_id,
    } = req.body

    const updatedPhoto = (await cloudinary.uploader.upload(req.file.path))
      .secure_url

    const finalPhoto = req.file ? updatedPhoto : currentPhoto

    const update_resume = await resumeSchema.updateOne(
      { _id: resumeId },
      {
        photo: finalPhoto,
        user_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        level_of_education,
        country,
        previous_work,
        current_work,
        skills,
        reference,
        language,
        template_id,
      }
    )

    return update_resume.modifiedCount === 1
      ? res.status(200).json({ msg: "resume updated successfully", resume })
      : res.status(404).json({ msg: "fialed to updated resume" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

// resume by user_id
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "user id not found" })
    }

    const user_resume = await resumeSchema.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "resume",
        },
      },
    ])

    return user_resume
      ? res.status(200).json({ msg: "success", user_resume })
      : res.status(404).json({ msg: "failed to get user's resume" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

router.get("/template/:id", async (req, res) => {
  try {
    const templateId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ msg: "template id not found" })
    }

    const resume = await resumeSchema.aggregate([
      {
        $match: {
          template_id: templateId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "resume_template",
        },
      },
    ])

    return resume
      ? res.status(200).json({ msg: "success", resume })
      : res.status(404).json({ msg: "failed to get template's resume" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "internal server error" })
  }
})

module.exports = router
