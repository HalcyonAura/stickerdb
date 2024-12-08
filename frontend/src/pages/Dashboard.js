import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadModal from "../components/UploadModal";
import axios from "axios";

const Dashboard = () => {
  const baseUrl = process.env.REACT_APP_API_URL; 

  const [stickers, setStickers] = useState([]); 
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect to login page if not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

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

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Your Dashboard</h1>
      <button onClick={() => setModalOpen(true)}>Upload New Sticker</button>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
        {stickers.map((sticker) => ( // updated
          <div key={sticker._id} className="sticker" style={{ margin: "20px" }}>
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
      {isModalOpen && (
        <UploadModal onClose={() => setModalOpen(false)} onSave={handleSaveSticker} />
      )}
    </div>
  );
};

export default Dashboard;