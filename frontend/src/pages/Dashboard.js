import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../components/UploadModal';
import { fetchImages } from '../utils/api'; // added after backend


const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

//   useEffect(() => {
//     setImages([
//       { id: 1, src: 'https://via.placeholder.com/150', metadata: 'Image 1' },
//       { id: 2, src: 'https://via.placeholder.com/150', metadata: 'Image 2' },
//     ]);
//   }, []);

  useEffect(() => { // added after backend
    const loadImages = async () => {
      try {
        const fetchedImages = await fetchImages();
        setImages(fetchedImages);
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    };
  
    loadImages();
  }, []);

  const handleSaveImage = (croppedImage) => {
    setImages([...images, { id: images.length + 1, src: croppedImage, metadata: 'New Image' }]);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Your Dashboard</h1>
      <button onClick={() => setModalOpen(true)}>Upload New Image</button>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {images.map((img) => (
          <div key={img.id} style={{ margin: '0 10px' }}>
            <img src={img.src} alt={img.metadata} style={{ width: '150px', height: '150px' }} />
            <p>{img.metadata}</p>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <UploadModal onClose={() => setModalOpen(false)} onSave={handleSaveImage} />
      )}
    </div>
  );
};

export default Dashboard;