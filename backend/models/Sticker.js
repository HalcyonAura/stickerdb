// BRAND NEW

const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema({
  image: {
    size: { type: Number, required: true },
    name: { type: String, required: true },
    dateMade: { type: Date, required: true },
    url: { type: String, required: true },
  },
  locationSource: { type: String, default: "Unknown" },
  description: { type: String, default: "No description" },
  amount: { type: Number, required: true },
  designerName: { type: String, default: "Unknown" },
  dateCollected: { type: Date, default: Date.now },
  stickerPrinter: { type: String, default: "Unknown" },
  ratings: {
    design: { type: Number, min: 0, max: 5 },
    quality: { type: Number, min: 0, max: 5 },
  },
});

module.exports = mongoose.model("Sticker", stickerSchema);