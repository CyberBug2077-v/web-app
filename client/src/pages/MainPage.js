import React, { useState, useEffect } from 'react';
import { Container, Grid, AppBar, Toolbar, IconButton, Avatar, Drawer, Box } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import CardPage from './CardPage';
import UserInfo from '../components/sider/UserInfo';
import Messages from '../components/sider/Messages';
import Settings from '../components/sider/Settings';
import CustomCard from './CustomCard';



function MainPage() {

    // A state to control the content of side bar
    const [sidebarContent, setSidebarContent] = useState(null);

    const [user, setUser] = useState({
        name: '',
        description: '',
        avatar: '',
    });
    const [customizingCard, setCustomizingCard] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (token) {
                // If token exists...
                try {
                    const response = await fetch('http://localhost:1234/api/profile', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser({
                            ...user,
                            name: data.name,
                            avatar: data.avatar,
                            description: data.description,
                        });
                    } else {
                        console.error('Failed to fetch user info');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };
        fetchUserInfo();
    }, []);

    // Update the Drawer switch function to set the appropriate component based on the button clicked when it is opened
    const openSidebarWithContent = (content) => {
        setSidebarContent(content);
    };

    // The function that closes the Drawer and resets the sidebarContent state.
    const closeSidebar = () => {
        setSidebarContent(null);
    };

    const drawerStyle = {
        width: '250px',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '250px',
          boxSizing: 'border-box',
          position: 'absolute'  // Make Drawer a inner element
        },
    };

    return (
        <Container maxWidth="lg">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => openSidebarWithContent('userInfo')}>
                        <Avatar src={user.avatar || `url(${process.env.PUBLIC_URL + '/assets/example_avatars/default.jpg'})`} alt={user.name} />
                    </IconButton>             
                    <div>{user.name}</div>
                    {/* Clicking the message button opens the sidebar and displays the chat list */}
                    <IconButton color="inherit" onClick={() => openSidebarWithContent('chatList')}>
                        <MessageIcon />
                    </IconButton>
                    {/* Click on the Settings button to open the sidebar and display the settings */}
                    <IconButton color="inherit" onClick={() => openSidebarWithContent('settings')}>
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2}>
                {customizingCard ? (
                    <Grid item xs={12}>
                        <CustomCard user={user} setUser={setUser} />
                    </Grid>
                ) : (
                    <>
                        <Grid item xs={12} md={8}>
                        {/* Render user cards here */}
                            <CardPage />
                        </Grid>
                        {/* Sidebar content is dynamically rendered based on the button clicked */}
                        <Grid item xs={12} md={4}>
                            {/* This is your sidebar */}
                            <Drawer
                                sx={drawerStyle}
                                variant="persistent"
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
                                                marginTop: 1,
                                                marginRight: 1,
                                            }}
                                        onClick={closeSidebar}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    {sidebarContent === 'userInfo' && <UserInfo user={user} setUser={setUser} setCustomizingCard={setCustomizingCard} />}
                                    {sidebarContent === 'chatList' && <Messages />}
                                    {sidebarContent === 'settings' && <Settings />}
                                </Box>
                            </Drawer>
                        </Grid>
                    </>
                )}
            </Grid>
        </Container>
    );            
}

export default MainPage;