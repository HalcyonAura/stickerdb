import React, { useEffect, useState } from "react";
import UploadModal from "../components/UploadModal";
import StickerEditModal from "../components/StickerEditModal";
import SignInUp from "../components/SignInUp";
import axios from "axios";

const Dashboard = (setAuth, isAuth, handleLogout) => {
  const baseUrl = process.env.REACT_APP_API_URL; 

  const [stickers, setStickers] = useState([]); 
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  
  // Fetch stickers from backend (MongoDB)
  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/stickers`);
        console.log("getting stickers", response.data);
        setStickers(response.data);
      } catch (err) {
        console.error("Error fetching stickers:", err);
      }
    };

    fetchStickers();
  }, []);

  // Save new sticker after uploading
  const handleSaveSticker = (newSticker) => {
    setStickers([...stickers, newSticker]);
  };

  // Set restrictions
  const handleEditSticker = (updatedSticker) => {
    if (isAuth){
      setSelectedSticker(updatedSticker);
      setEditModalOpen(true);
    } else {
      alert("You must be logged in to edit a sticker");
    }
  }

  const handleEditSaveSticker = (updatedSticker) => {
    console.log("handling edit save");
    setStickers((prevStickers) => 
      prevStickers.map((sticker) =>
        sticker._id === updatedSticker._id ? updatedSticker : sticker
  ));
    setEditModalOpen(false);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Your Dashboard</h1>
      { !isAuth && <SignInUp setAuth={setAuth} />}
      { isAuth && (
        <>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => setCreateModalOpen(true)}>Upload New Sticker</button>
        </>)
      }
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
        {stickers.map((sticker) => (
          <div key={sticker._id} className="sticker" style={{ margin: "20px" }} onClick={() => handleEditSticker(sticker)}>
            <img src={`${baseUrl}${sticker.image.url}`} alt={sticker.image.name} style={{ width: "150px", height: "150px", objectFit: "cover" }} />
            <div>
              <p><strong>{sticker.image.name}</strong></p>
              <p>{sticker.locationSource && `Location: ${sticker.locationSource}`}</p>
              <p>{sticker.amount && `Amount: ${sticker.amount}`}</p>
              <p>{sticker.designerName && `Designer: ${sticker.designerName}`}</p>
              <p>{sticker.dateCollected && `Collected: ${sticker.dateCollected}`}</p>
              <p>{sticker.stickerPrinter && `Printer: ${sticker.stickerPrinter}`}</p>
              <p>{sticker.designRating && `Design Rating: ${sticker.designRating}`}</p>
              <p>{sticker.qualityRating && `Quality Rating: ${sticker.qualityRating}`}</p>
            </div>
          </div>
        ))}
      </div>
      {isCreateModalOpen && (
        <UploadModal onClose={() => setCreateModalOpen(false)} onSave={handleSaveSticker} />
      )}
      {isEditModalOpen && selectedSticker && (
        <StickerEditModal sticker={selectedSticker} onClose={() => setEditModalOpen(false)} onSave={handleEditSaveSticker} />
      )}
    </div>
  );
};

export default Dashboard;