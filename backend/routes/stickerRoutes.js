// BRAND NEW/REDO ROUTES.JS

const express = require("express");
const router = express.Router();
const Sticker = require("../models/Sticker");
const {upload, saveFile} =require("../middleware/upload"); 

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
router.post("/sticker", upload.single("image"), async (req, res) => {
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

module.exports = router;