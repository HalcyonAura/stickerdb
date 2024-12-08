import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import { getCroppedImg } from "../utils/cropImage";

const UploadModal = ({ onClose, onSave }) => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL; 

  // Add state for metadata fields
  const [locationSource, setLocationSource] = useState("");
  const [amount, setAmount] = useState(1);
  const [designerName, setDesignerName] = useState("");
  const [dateCollected, setDateCollected] = useState("");
  const [stickerPrinter, setStickerPrinter] = useState("");
  const [designRating, setDesignRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      // Crop the image
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);

      // Create FormData
      const formData = new FormData();
      console.log(croppedImageBlob); // Should be a valid Blob object
      // UPDATED
      formData.append("image", croppedImageBlob, "croppedImage.jpg");
      formData.append("locationSource", locationSource);
      formData.append("amount", amount);
      formData.append("designerName", designerName);
      formData.append("dateCollected", dateCollected);
      formData.append("stickerPrinter", stickerPrinter);
      formData.append("designRating", designRating);
      formData.append("qualityRating", qualityRating);

      // Make API call
      const response = await axios.post(`${baseUrl}/api/sticker`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Trigger callback
      onSave(response.data);

      // Close the modal
      onClose();
    } catch (err) {
      console.error("Error saving sticker:", err);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.content}>
        <h2>Upload and Crop Image</h2>
        {!image ? (
          <input type="file" accept="image/*" onChange={handleFileChange} />
        ) : (
          <div style={{ position: "relative", width: "100%", height: "300px" }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              objectFit="vertical-cover"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Location Source"
            value={locationSource}
            onChange={(e) => setLocationSource(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Designer Name"
            value={designerName}
            onChange={(e) => setDesignerName(e.target.value)}
            style={styles.input}
          />
          <input
            type="date"
            placeholder="Date Collected"
            value={dateCollected}
            onChange={(e) => setDateCollected(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Sticker Printer"
            value={stickerPrinter}
            onChange={(e) => setStickerPrinter(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Design Rating"
            value={designRating}
            onChange={(e) => setDesignRating(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Quality Rating"
            value={qualityRating}
            onChange={(e) => setQualityRating(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          {image && <button onClick={handleSave}>Save</button>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
};

export default UploadModal;