import React, { useState } from 'react';
import { Box, Tab, Tabs, TextField, Button, Paper } from '@mui/material';
import ShopIcon from '@mui/icons-material/Shop';

const Login = () => {
  const [tabValue, setTabValue] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogin = () => {
    fetch('http://localhost:1234/api/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Save JWT
      localStorage.setItem('token', data.token);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleRegister = () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('profile', JSON.stringify({
      name,
      description,
    }));
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      formData.append('avatar', fileInput.files[0]);
    }

    fetch('http://localhost:1234/api/account/register', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/users/auth/google';
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, margin: 'auto', mt: 10 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Login" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        {tabValue === 'register' && (
          <>
            <TextField
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Box sx={{ mb: 2, mt: 2 }}>
              <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Upload Avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
              {avatar && <Box sx={{ mt: 2 }}><img src={avatar} alt="Avatar Preview" style={{ width: '100px', height: '100px' }}/></Box>}
            </Box>
            <TextField
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </>
        )}
        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{ mb: 2 }}
          onClick={tabValue === 'login' ? handleLogin : handleRegister}
        >
          {tabValue === 'login' ? 'Login' : 'Register'}
        </Button>
        {tabValue === 'login' && (
          <Button
            variant="outlined"
            startIcon={<ShopIcon />}
            fullWidth
            onClick={handleGoogleLogin}
          >
            Use Google Account To Login
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default Login;

