import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import Chat from '../../modals/chat';

const Messages = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const chats = [
    { name: 'Alice', unread: true },
    { name: 'Bob', unread: false },
    { name: 'Charlie', unread: true },
  ];

  const handleChatClick = (chat) => {
    setCurrentChat(chat);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false); // Close
  };

  return (
    <Box p={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>Chats</Typography>
      <List sx={{ border: '1px solid #ccc', borderRadius: '4px' }}>
        {chats.map((chat) => (
          <ListItem 
            button 
            key={chat.id}
            onClick={() => handleChatClick(chat)}
            sx={{
              borderColor: 'divider',
              borderBottom: chats.indexOf(chat) < chats.length - 1 ? '1px solid #ccc' : '',
              bgcolor: chat.unread ? 'wheat' : 'inherit',
            }}
          >
            <ListItemAvatar>
              <Avatar>{chat.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={chat.name} />
          </ListItem>
        ))}
      </List>
      {showChat && <Chat chatId={currentChat.id} onClose={handleCloseChat} />}
    </Box>
  );

};

export default Messages;
