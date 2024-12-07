import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { uploadImage } from '../utils/api'; // added after backend

const UploadModal = ({ onClose, onSave }) => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);


  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      const formData = new FormData();
      formData.append('image', croppedImage, 'cropped-image.jpg');
      formData.append('metadata', 'Custom metadata');
  
      const uploadedImage = await uploadImage(formData);
      onSave(uploadedImage); // Update parent state with the new image
      onClose();
    } catch (err) {
      console.error('Error cropping image:', err);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.content}>
        <h2>Upload and Crop Image</h2>
        {!image ? (
          <input type="file" accept="image/*" onChange={handleFileChange} />
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1} // Square crop
              objectFit="vertical-cover"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
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

export default UploadModal;