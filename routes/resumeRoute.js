const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const resumeSchema = require("../models/resumeSchema");
const cloudinary = require("../utilities/cloudinary");
const upload = require("../middleware/multer");

router.post("/create", upload.single("photo"), async (req, res) => {
  try {
    const {
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
    } = req.body;

    let photo;

    if (req.file) {
      photo = (await cloudinary.uploader.upload(req.file.path)).secure_url;
    }

    //   const resumeExist = await resumeSchema.findOne({})

    const newResume = new resumeSchema({
      photo,
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
    });

    const saved_resume = await newResume.save();

    return saved_resume
      ? res
          .status(200)
          .json({ msg: "resume created succesfully", saved_resume })
      : res.status(404).json({ msg: "fialed to create resume" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const all_resume = await resumeSchema.find().sort({ dateCreated: -1 });

    res.status(200).json({
      msg: "success",
      resume_count: all_resume.length,
      all_resume,
    });
  } catch (err) {
    console.log(err);
    res.statusCode(500).json({ msg: "internal server error" });
  }
});

// single resume
router.get("/one/:id", async (req, res) => {
  try {
    const resumeId = req.params.id;

    if (!resumeId) {
      return res.status(400).json({ msg: "resume id not found" });
    }

    const resume = await resumeSchema.findOne({ _id: resumeId });

    res.status(200).json({ msg: "success", user: resume });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const resumeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      res.status(400).json({ msg: "user id not found" });
    }

    const resume = await resumeSchema.findByIdAndDelete(resumeId);

    return resume
      ? res.status(200).json({ msg: "resumer deleted successfully", resume })
      : res.status(500).json({ msg: "failed to delete resumer" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const resumeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ msg: "resume id not found" });
    }

    const {
      photo,
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
    } = req.body;

    const resume = await resumeSchema.updateOne(
      { _id: resumeId },
      {
        photo,
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
    );

    return resume.modifiedCount === 1
      ? res.status(200).json({ msg: "resume updated successfully", resume })
      : res.status(404).json({ msg: "fialed to updated resume" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "user id not found" });
    }

    const user_resume = await resumeSchema.aggregate([
      {
        $match: {
          user_id: userId,
        },
      },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "user_id",
      //       foreignField: "_id",
      //       as: "user_resume",
      //     },
      //   },
    ]);

    return user_resume
      ? res.status(200).json({ msg: "success", user_resume })
      : res.status(404).json({ msg: "failed to get user's resume" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.get("/template/:id", async (req, res) => {
  try {
    const templateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ msg: "user id not found" });
    }

    const template_resume = await resumeSchema.aggregate([
      {
        $match: {
          template_id: templateId,
        },
      },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "user_id",
      //       foreignField: "_id",
      //       as: "user_resume",
      //     },
      //   },
    ]);

    return template_resume
      ? res.status(200).json({ msg: "success", user_resume: template_resume })
      : res.status(404).json({ msg: "failed to get template's resume" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

module.exports = router;
