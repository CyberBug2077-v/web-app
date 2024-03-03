import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs, TextField, Button, Paper, Alert } from '@mui/material';
import ShopIcon from '@mui/icons-material/Shop';

const Login = () => {
  const [tabValue, setTabValue] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate(); 

  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');

  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);  // Store the file in the state
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const validateForm = () => {
    

    if (password.length < 8) {
      alert("Your password must be at least 8 characters long.");
      return false;
    }

    return true;
  };
  const handleLogin = () => {
    // You may want to add client-side validation here as well.
    fetch('http://localhost:1234/api/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        // If the response is not ok, parse and throw the error.
        return response.json().then(error => {
          throw new Error(error.msg || "Login failed");
        });
      }
    })
    .then(data => {
      console.log('Success:', data);
      // Save JWT
      localStorage.setItem('token', data.token);
      // Redirect the user or perform other actions on successful login
      navigate('/');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("There was a problem with your login: " + error.message);
    });
  };
  

  const handleRegister = () => {
    if (!validateForm()) {
      return; // Stop the registration process if validation fails
    }
  
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    
  
    // Append the avatar file if it has been uploaded
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      formData.append('avatar', fileInput.files[0]);
    }
   

    // Append the avatar file to the FormData if it exists
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    fetch('http://localhost:1234/api/account/register', {
      method: 'POST',
      body: formData, // Send the formData object
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error('Registration failed:', errorData);
          throw new Error(`Error: ${response.status} - ${errorData.message}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // Possibly redirect to login page or a success page
      setRegistrationSuccess(true);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("There was a problem with your registration: " + error.message);
    });
  };
  
  
  

  const handleGoogleLogin = () => {
    window.location.href = '/api/users/auth/google';
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, margin: 'auto', mt: 10 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        {registrationSuccess && <Alert severity="success">Registration successful!</Alert>}
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

