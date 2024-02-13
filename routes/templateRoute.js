const express = require("express");
const router = express.Router();
const templateSchema = require("../models/templateSchema");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    res.json({ msg: "welcome to resume craft" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/create", async (req, res) => {
  try {
    //   creds
    const { user_id, hasPhoto, resume_id, color } = req.body;

    const newTemplate = new templateSchema({
      user_id,
      hasPhoto,
      resume_id,
      color,
    });

    //   saved
    const template = await newTemplate.save();

    return template
      ? res.status(200).json({ msg: "template created successfully", template })
      : res.status(404).json({ msg: "failed to create template" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const all_templates = await templateSchema.find();

    res.status(200).json({
      msg: "sucess",
      template_count: all_templates.length,
      all_templates,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const templateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      res.status(400).json({ msg: "template id not found" });
    }

    const delete_template = await templateSchema.findByIdAndDelete(templateId);

    return delete_template
      ? res
          .status(200)
          .json({ msg: "template deleted successfully", delete_template })
      : res.status(500).json({ msg: "failed to delete template" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const templateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      res.status(400).json({ msg: "template id not found" });
    }

    const { user_id, hasPhoto, resume_id, color } = req.body;

    const update_template = await templateSchema.updateOne(
      { _id: templateId },
      {
        user_id,
        hasPhoto,
        resume_id,
        color,
      }
    );

    return update_template.modifiedCount === 1
      ? res
          .status(200)
          .json({ msg: "template updated successfully", update_template })
      : res.status(404).json({ msg: "fialed to updated template" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.get("/one/:id", async (req, res) => {
  try {
    const templateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      res.status(400).json({ msg: "template id not found" });
    }

    const single_template = await templateSchema.findOne({ _id: templateId });

    res.status(200).json({ msg: "success", single_template });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});

router.get("/resume/:id", async (req, res) => {
  try {
    const resumeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      res.status(400).json({ msg: "resume id not found" });
    }

    const template_module = await templateSchema.find({
      resume_id: resumeId,
    });

    res.status(200).json({ msg: "success", template_module });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
  }
});
module.exports = router;
