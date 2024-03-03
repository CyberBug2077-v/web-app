import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import UserCard from '../components/UserCard/UserCard';
import { useNavigate } from 'react-router-dom';

const CardPage = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:1234/api/cards', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setCards(data);
    } else {
      console.error('Failed to fetch cards:', response.statusText);
    }
  };

  const handleSwipeLeft = (card) => {
    console.log('Swiped left on user:', card._id);
    handleDislike(card._id);
  };

  const handleSwipeRight = async (card) => {
    console.log('Swiped right on user:', card._id);
    await handleLike(card);
  };

  const handleLike = async (card) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:1234/api/card/like', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ likedUserId: card.userId }),
        });
  
        const data = await response.json();
        if (response.ok) {
            // Log the success message
            console.log(data.message);
            // Navigate to chat page if a chatId is returned
            if (data.chatId) {
                navigate(`/chat/${data.chatId}`);
            }
        } else {
            throw new Error(data.message || 'Error liking the user.');
        }
    } catch (error) {
        console.error('Like failed:', error);
    }
  };

  const handleDislike = (cardId) => {
    // Here you can implement the logic to handle the dislike
    console.log('Disliked card with ID:', cardId);
    setCards(cards.filter((card) => card._id !== cardId));
    // You can also call an API endpoint to update the dislike in your backend
  };

  return (
    <Container>
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 2,
        padding: 2,
      }}>
      {cards.map((card, index) => (
        <UserCard
          key = {card._id}
          card={card}
          onSwipeLeft={() => handleSwipeLeft(card)}
          onSwipeRight={() => handleSwipeRight(card)}
          onLike={() => handleLike(card)}
          style = {{
            position: 'absolute',
            top: `${index * 10}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: cards.length - index,
            transition: 'transform 0.5s',
          }}
        />
      ))}
    </Box>
  </Container>
  );
};

export default CardPage;
