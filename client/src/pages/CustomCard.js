import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const CustomCard = ({ user, setUser }) => {
  const [cardDescription, setCardDescription] = useState('');
  const [cardImage, setCardImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:1234/api/account/card', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      // If user has a card, show the content
      if (data.backgroundImage) setCardImage(data.backgroundImage);
      if (data.description) setCardDescription(data.description);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardImage(e.target.result); // Read URL of image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (e) => {
    setCardDescription(e.target.value);
  };

  const handleSaveCustomCard = () => {
    // Logic to save the customized card
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('description', cardDescription);
    if (typeof cardImage === 'string') {
      formData.append('backgroundImage', cardImage);
    } else {
      formData.append('cardImage', cardImage, cardImage.name);
    }

    fetch('http://localhost:1234/api/card', {
      method: 'POST', // 或使用 PUT，视后端接口而定
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Card saved:', data);
      navigate('/');
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', }}>
      <input
        accept="image/*"
        type="file"
        onChange={handleImageChange}
        id="image-upload"
        style={{ display: 'none' }}
      />
      <label htmlFor="image-upload">
        <Box
            sx={{
              width: 300,
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: cardImage ? 'transparent' : '#f0f0f0',
              borderRadius: '8px',
              borderStyle: 'dashed',
              borderColor: 'primary.main',
              marginBottom: 2,
              backgroundImage: `url(${cardImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <IconButton color="primary" aria-label="upload picture" component="span">
              {!cardImage && <AddIcon fontSize="large" />}
            </IconButton>
        </Box>
      </label>
      <Typography variant="h6" gutterBottom>
        {user.name}
      </Typography>
      <textarea
        placeholder="Describe your card..."
        value={cardDescription}
        onChange={handleDescriptionChange}
        style={{ width: '300px', height: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', }}
      />
      <Button variant="contained" color="primary" onClick={handleSaveCustomCard} sx={{ marginTop: 2 }}>
        Save Custom Card
      </Button>
    </Box>
  );
};

export default CustomCard;
