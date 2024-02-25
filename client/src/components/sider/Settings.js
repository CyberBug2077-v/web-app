import React, { useState } from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';

const Settings = () => {

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const handleNotificationsChange = (event) => {
    setIsNotificationsEnabled(event.target.checked); // 更新状态
  };

  return (
    <Box p={2}>
      <Typography variant="h6">Settings</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={isNotificationsEnabled}
            onChange={handleNotificationsChange}
          />
        }
        label="Enable Notifications"
      />
      {/* ...Other settings */}
    </Box>
  );
};

export default Settings;
