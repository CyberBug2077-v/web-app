import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const UserInfo = ({ user }) => {
  console.log(user)
  return (
    <Box p={2} sx={{ maxWidth: 345, margin: 'auto' }}>
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar src={user.avatar} sx={{ width: 100, height: 100 }} />
      </Box>
      <Typography variant="h6" gutterBottom>
        Name: {user.name || 'N/A'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bio: {user.description || 'N/A'}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Joined on: {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US") : 'N/A'}
      </Typography>
      {/* Other user information can be displayed here */}
    </Box>
  );
};

export default UserInfo;
