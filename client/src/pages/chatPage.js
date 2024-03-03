import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, IconButton, Avatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import moment from 'moment'; // You need to install moment for this: npm install moment

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { chatId } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:1234/api/chat/${chatId}?page=${page}&searchTerm=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
          setTotalPages(data.totalPages);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Fetch messages error:', error);
      }
    };

    fetchMessages();
  }, [chatId, token, page, searchTerm]);

  // ... existing sendMessage function
  const sendMessage = async () => {
    try {
      const response = await fetch('http://localhost:1234/api/chat/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, message: newMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add the new message to the local state
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
        setNewMessage(''); // Clear the input field
      } else {
        console.error('Failed to send message:', response.statusText);
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      {/* Search Field */}
      <TextField
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search messages..."
        variant="outlined"
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setPage(1)}>
              <SearchIcon />
            </IconButton>
          ),
        }}
        sx={{ mb: 2 }}
      />
      {/* Messages List */}
      <Paper sx={{ maxHeight: '60vh', overflowY: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Avatar 
              src={msg.sender && msg.sender.profile && msg.sender.profile.avatar ? msg.sender.profile.avatar : ''}
              sx={{ mr: 1 }}
            /> {/* Show user avatar */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ display: 'inline', mr: 1 }}>
                {msg.sender.username}:
              </Typography>
              <Typography variant="body2" sx={{ display: 'inline' }}>
                {msg.message}
            </Typography>
            </Box>
            <Typography variant="caption" sx={{ alignSelf: 'flex-end' }}>
              {moment(msg.timestamp).format('LT')} {/* Display time in a readable format */}
            </Typography>
          </Box>
        ))}
      </Paper>
      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <IconButton onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page <= 1}>
          <NavigateBeforeIcon />
        </IconButton>
        <Typography sx={{ mx: 2 }}>{page} / {totalPages}</Typography>
        <IconButton onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page >= totalPages}>
          <NavigateNextIcon />
        </IconButton>
      </Box>
      {/* Send Message Box */}
      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          sx={{ mr: 1 }}
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default ChatPage;
