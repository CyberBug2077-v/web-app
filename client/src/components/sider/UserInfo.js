import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


const UserInfo = ({ user, setUser, setCustomizingCard }) => {

  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user });

  const handleCustomizeCardClick = () => {
    setCustomizingCard(true); // This will trigger the CustomCard view in MainPage
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:1234/api/profile/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Authenticate with beaer token
      },
      body: JSON.stringify({
        name: tempUser.name,
        avatar: tempUser.avatar, 
        description: tempUser.description,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Profile updated successfully:', data);
      setUser({ ...user, ...data }); // update state
      setEditMode(false); // exit edit mode
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <Box p={2} sx={{ maxWidth: 345, margin: 'auto' }}>
      {/* User profile */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar src={user.avatar} sx={{ width: 100, height: 100 }} />
      </Box>
      {/* User name and description */}
      {!editMode ? (
        <>
          <Typography variant="h6" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {user.description}
          </Typography>
          <Button 
            startIcon={<EditIcon />} 
            onClick={() => setEditMode(true)}
            sx={{ marginBottom: 2 }}
          >
            Edit user profile
          </Button>
          <Button variant="outlined" onClick={handleCustomizeCardClick}>
            Custom user card
          </Button>
        </>
      ) : (
        // Form under edit mode
        <>
          <TextField
            label="User name"
            name="name"
            value={user.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={user.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ marginTop: 2 }}
          >
            Save
          </Button>
        </>
      )}
    </Box>
  );
};

export default UserInfo;
