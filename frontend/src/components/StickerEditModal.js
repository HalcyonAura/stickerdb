import React, { useState, useEffect } from "react";
import axios from "axios";

const StickerEditModal = ({ sticker, onSave, onClose }) => {
    const [locationSource, setLocationSource] = useState(sticker.locationSource);
    const [amount, setAmount] = useState(sticker.amount);
    const [designerName, setDesignerName] = useState(sticker.designerName);
    const [dateCollected, setDateCollected] = useState(sticker.dateCollected);
    const [stickerPrinter, setStickerPrinter] = useState(sticker.stickerPrinter);
    const [designRating, setDesignRating] = useState(sticker.ratings?.designRating || 0);
    const [qualityRating, setQualityRating] = useState(sticker.ratings?.qualityRating || 0);
    const baseUrl = process.env.REACT_APP_API_URL; 

    useEffect(() => {
        setLocationSource(sticker.locationSource);
        setAmount(sticker.amount);
        setDesignerName(sticker.designerName);
        setDateCollected(sticker.dateCollected);
        setStickerPrinter(sticker.stickerPrinter);
        setDesignRating(sticker.ratings?.designRating);
        setQualityRating(sticker.ratings?.qualityRating);
    }, [sticker]);

    const handleSave = async () => {
        try {
            console.log("handling save");
            const updatedSticker = {
                locationSource,
                amount,
                designerName,
                dateCollected,
                stickerPrinter,
                ratings: {
                    designRating,
                    qualityRating,
                }
            }
            const response = await axios.put(`${baseUrl}/api/sticker/${sticker._id}`, updatedSticker);
            onSave(response.data);
            onClose();
        } catch (err) {
            console.error("Error updating sticker:", err);
        }
    }
    return(
        <div style={styles.modal}>
            <div style={styles.content}>
            <h2>Edit Sticker</h2>
            <form>
            <input
            type="text"
            placeholder="Location Source"
            value={locationSource}
            onChange={(e) => setLocationSource(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Designer Name"
            value={designerName}
            onChange={(e) => setDesignerName(e.target.value)}
          />
          <input
            type="date"
            placeholder="Date Collected"
            value={dateCollected}
            onChange={(e) => setDateCollected(e.target.value)}
          />
          <input
            type="text"
            placeholder="Sticker Printer"
            value={stickerPrinter}
            onChange={(e) => setStickerPrinter(e.target.value)}
          />
          <input
            type="number"
            placeholder="Design Rating"
            value={designRating}
            onChange={(e) => setDesignRating(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quality Rating"
            value={qualityRating}
            onChange={(e) => setQualityRating(e.target.value)}
          />
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="button" onClick={handleSave}>Save</button>
            </form>
        </div>
        </div>
    );
}

const styles = {
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    content: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '400px',
      textAlign: 'center',
    },
    actions: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
export default StickerEditModal;