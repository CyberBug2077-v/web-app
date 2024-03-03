import React, { useState, useEffect } from 'react';
import { Container, Grid, AppBar, Toolbar, IconButton, Avatar, Typography, Drawer, Box, Button } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import CardPage from './CardPage';
import UserInfo from '../components/sider/UserInfo';
import Messages from '../components/sider/Messages';
import Settings from '../components/sider/Settings';
import CustomCard from './CustomCard';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const [customizingCard, setCustomizingCard] = useState(false);
  const navigate = useNavigate();
  const [sidebarContent, setSidebarContent] = useState(null);
  const [showCustomCard, setShowCustomCard] = useState(false);
  const [user, setUser] = useState({
    name: '',
    description: '',
    avatar: '',
    createdAt: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUserInfo(token);
    }
  }, [navigate]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://localhost:1234/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Fetched user data:', data); // Log the fetched data
      if (response.ok) {
        // Map the response data to the state appropriately
        setUser({
         name: data.username , // Use profile name or username
          
          description: data.profile.description , // Description from the profile
          avatar: data.profile.avatar, 
          createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-US") : 'N/A', // CreatedAt from the user object
        });
        console.log(user)
      } else {
        console.error('Failed to fetch user info:', data.message);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      
    }
  };
  
  

  const openSidebarWithContent = (content) => {
    setSidebarContent(content);
  };

  const closeSidebar = () => {
    setSidebarContent(null);
  };
  
  const viewUserProfile = (userId) => {
    console.log('User profile clicked for user:', userId);
    // Add navigation or state update logic here to show the user profile
  };
  const toggleCustomCard = () => {
    setShowCustomCard(!showCustomCard); // Toggle the visibility
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="user" onClick={() => openSidebarWithContent('userInfo')}>
            <Avatar src={user.avatar || `${process.env.PUBLIC_URL + '/assets/example_avatars/default.jpg'}`} alt={user.name} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {user.name}
          </Typography>
          <IconButton color="inherit" onClick={() => openSidebarWithContent('chatList')}>
            <MessageIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => openSidebarWithContent('settings')}>
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Typography variant="button">Logout</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2}>
        {/* Toggle button for CustomCard */}
        <Grid item xs={12}>
          <Button onClick={toggleCustomCard} variant="contained" sx={{ my: 2 }}>
            {showCustomCard ? 'Hide Custom Card' : 'Customize Card'}
          </Button>
        </Grid>
        {/* Conditionally render CustomCard */}
        {showCustomCard && (
          <Grid item xs={12}>
            <CustomCard user={user} setUser={setUser} setCustomizingCard={setCustomizingCard} />
          </Grid>
        )}
        <CardPage onCardClick={viewUserProfile} />
        <Drawer
          sx={{
            width: 250,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
            },
          }}
          anchor="right"
          open={Boolean(sidebarContent)}
          onClose={closeSidebar}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <IconButton
              sx={{
                alignSelf: 'flex-end',
                m: 1,
              }}
              onClick={closeSidebar}
            >
              <CloseIcon />
            </IconButton>
            {sidebarContent === 'userInfo' && <UserInfo user={user} />}
            {sidebarContent === 'chatList' && <Messages />}
            {sidebarContent === 'settings' && <Settings />}
          </Box>
        </Drawer>
      </Grid>
    </Container>
  );
}

export default MainPage;
