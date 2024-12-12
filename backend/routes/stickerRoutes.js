const express = require("express");
const router = express.Router();
const Sticker = require("../models/Sticker");
const {upload, saveFile} =require("../middleware/upload"); 
const passport = require("passport");

// GET all stickers
router.get("/stickers", async (req, res) => {
    try {
      const stickers = await Sticker.find().sort({ "image.dateCollected": -1 });
      res.json(stickers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// POST a new sticker
// Upload a cropped image and save metadata
router.post("/sticker", upload.single("image"), passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
    console.log(req.body);  // Debug log to inspect form fields
    console.log(req.file);   // Debug log to inspect uploaded file
      const fileMetadata = saveFile(req.file);
  
      // Construct sticker metadata
      const newSticker = new Sticker({
        image: {
          size: fileMetadata.size,
          name: fileMetadata.name,
          dateMade: new Date(),
          url: fileMetadata.url,
        },
        locationSource: req.body.locationSource,
        amount: req.body.amount,
        designerName: req.body.designerName,
        dateCollected: req.body.dateCollected,
        stickerPrinter: req.body.stickerPrinter,
        ratings: {
          design: req.body.designRating,
          quality: req.body.qualityRating,
        },
      });
  
      const savedSticker = await newSticker.save();
      res.status(201).json(savedSticker);
    } catch (err) {
    console.error("Error saving sticker:", err); // Log the error for debugging
      res.status(400).json({ error: err.message });
    }
  });

// GET a specific sticker
router.get("/sticker/:id", async (req, res) => {
    try {
      const sticker = await Sticker.findById(req.params.id);
      if (sticker == null) {
        return res.status(404).json({ message: "Cannot find sticker" });
      }
      console.log(sticker);
      res.json(sticker);
    } catch (err) {
        console.log(err);
      return res.status(500).json({ message: err.message });
    }
  }); 


// PUT (edit) a specific sticker
router.put("/sticker/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
      console.log(req.body);
      const sticker = await Sticker.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      res.json(sticker);
    } catch (err) {
        console.log(err);
      return res.status(500).json({ message: err.message });
    }
  });

module.exports = router;