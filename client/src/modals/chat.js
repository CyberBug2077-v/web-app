import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const Chat = ({ onClose }) => {
    const [messages, setMessages] = useState([]); // Save the messages from backend
    const [searchTerm, setSearchTerm] = useState(""); // Text in the search box
    const [currentMessage, setCurrentMessage] = useState(""); // Text in the input box

    useEffect(() => {
        // fetchChatMessages().then(data => setMessages(data));
        setMessages([
          { id: 1, sender: 'Alice', content: 'Hi there!', timestamp: '11:23 PM', avatar: 'path/to/alice/avatar' },
          { id: 2, sender: 'Bob', content: 'Hello!', timestamp: '11:24 PM', avatar: 'path/to/bob/avatar' },
          // ... example messages
        ]);
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSendMessage = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, user must be logged in to send messages');
        return;
      }

      const chatId = 'someChatId';
      const messageText = currentMessage;

      fetch('http://localhost:1234/api/chat/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ chatId, messageText }),
      })
      .then(response => {
        if(!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Message sent successfully:', data);
        setCurrentMessage(''); // Clear input box
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    };

    const handleCurrentMessageChange = (e) => {
        setCurrentMessage(e.target.value);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Box>
          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {messages
              .filter(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((message, index) => (
                <ListItem key={message.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={message.sender} src={message.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography type="body2" color="textPrimary">
                        {message.sender}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {message.content}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                          sx={{ display: 'block' }}
                        >
                          {message.timestamp}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
          </List>
          <Box sx={{ p: 2, display: 'flex' }}>
            <TextField
              placeholder="Write a message..."
              fullWidth
              multiline
              maxRows={4}
              value={currentMessage}
              onChange={handleCurrentMessageChange}
            />
            <Button
              sx={{ ml: 1 }}
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      );

};

export default Chat;