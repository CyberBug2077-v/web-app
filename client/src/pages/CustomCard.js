import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';

const CustomCard = () => {
  const [cardDescription, setCardDescription] = useState('');
  const [cardImage, setCardImage] = useState(null);
  const [cardImageFile, setCardImageFile] = useState(null);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
  const [userAvatarFile, setUserAvatarFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCardImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setCardImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  const updateProfileAndCard = async () => {
    const token = localStorage.getItem('token');
    const profileFormData = new FormData();
    const cardFormData = new FormData();

    // Append user name and avatar to profile form data
    profileFormData.append('userName', userName);
    if (userAvatarFile) {
      profileFormData.append('avatar', userAvatarFile);
    }

    // Append card description and image to card form data
    cardFormData.append('description', cardDescription);
    if (cardImageFile) {
      cardFormData.append('cardImage', cardImageFile);
    }}
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUserAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (e) => setCardDescription(e.target.value);
  const handleUserNameChange = (e) => setUserName(e.target.value);

  const handleSaveCustomCard = async () => {
    const token = localStorage.getItem('token');
    
    // Form data for the profile
    const profileFormData = new FormData();
    profileFormData.append('userName', userName);
    profileFormData.append('description', cardDescription);
    if (userAvatarFile) {
      profileFormData.append('avatar', userAvatarFile);
  }
    
    
    // Form data for the card
    const cardFormData = new FormData();
    cardFormData.append('description', cardDescription);
    cardFormData.append('userName', userName); // Ensure userName is appended
    if (cardImageFile) {
      cardFormData.append('cardImage', cardImageFile);
    }
  
    try {
      // Update profile
      let profileResponse = await fetch('http://localhost:1234/api/profile', {
        method: 'PUT', // or 'POST', if you're creating a new profile
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' should not be set manually
        },
        body: profileFormData,
      });
  
      if (!profileResponse.ok) throw new Error('Profile update failed');
  
      // Create/Update card
      let cardResponse = await fetch('http://localhost:1234/api/card', {
        method: 'POST', // Assuming this creates a new card or updates it
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' should not be set manually
        },
        body: cardFormData,
      });
  
      if (!cardResponse.ok) throw new Error('Card update failed');
  
      const cardData = await cardResponse.json(); // Get the response data for the card
      // Update state or perform additional actions with cardData if necessary
  
      setSnackbarMessage('Profile and card updated successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Failed to update profile and card');
      setOpenSnackbar(true);
    }
  };
  
  

  return (
    <Box sx={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh'
    }}>
      {/* User Name Input */}
      <TextField
        label="Your Name"
        value={userName}
        onChange={handleUserNameChange}
        variant="outlined"
        sx={{ mb: 2, width: '300px' }} // Ensure the width matches the other inputs
      />
      {/* User Avatar Upload */}
      <Box
        sx={{
          mb: 2, // Add some bottom margin
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <input
          accept="image/*"
          type="file"
          onChange={handleAvatarChange}
          id="avatar-upload"
          style={{ display: 'none' }}
        />
        <label htmlFor="avatar-upload">
          <IconButton color="primary" aria-label="upload avatar" component="span">
            <AddIcon fontSize="large" />
          </IconButton>
        </label>
        {userAvatar && <img src={userAvatar} alt="Avatar Preview" height="100" />}
      </Box>
      {/* Card Image Upload */}
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
      {/* Card Description Input */}
      <textarea
        placeholder="Describe your card..."
        value={cardDescription}
        onChange={handleDescriptionChange}
        style={{
          width: '300px', 
          height: '100px', 
          padding: '10px', 
          borderRadius: '4px', 
          border: '1px solid #ccc',
          marginBottom: '2', // Add some bottom margin
        }}
      />
      {/* Save Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSaveCustomCard} 
        sx={{ marginTop: 2 }}
      >
        Save Custom Card
      </Button>
      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
  
};

export default CustomCard;
