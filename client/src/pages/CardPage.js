import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import UserCard from '../components/UserCard/UserCard';

const usersData = [
    { id: 1, name: 'Alice', details: 'Loves cats and climbing.' },
    { id: 2, name: 'Bob', details: 'Enjoys music and hiking.' },
    // ...Other users
];

const CardPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // fetchUsers().then(data => setUsers(data));
        setUsers(usersData);
    }, []);
  
        // User dislike
    const handleSwipeLeft = (userId) => {
        console.log('Swiped left on user:', userId);
        // Remove dragged card from list
        setUsers(users.filter(user => user.id !== userId));
    };

    // User like
    const handleSwipeRight = (userId) => {
        console.log('Swiped right on user:', userId);
        setUsers(users.filter(user => user.id !== userId));

        const token = localStorage.getItem('token');
        fetch('http://localhost:1234/api/card/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                likedUserId: userId,
                like: true
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Like response:', data);
        })
        .catch(error => {
            console.error('Error liking user:', error);
        });
    };

    return (
        <Container>
            <Box sx={{
                display: 'flex', // Use flexbox
                alignItems: 'center', // Center vertically
                justifyContent: 'center', // Center horizontally
                height: '100vh', // Full viewport height
                marginTop: '0px',
                overflow: 'hidden',
            }}>
                {users.map((user, index) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onSwipeLeft={() => handleSwipeLeft(user.id)}
                            onSwipeRight={() => handleSwipeRight(user.id)}
                            // We apply the zIndex inversely so that the first card is on top
                            style={{
                                position: 'absolute',
                                top: `${index * 10}px`,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: users.length - index,
                                transition: 'transform 0.5s',
                                // We can add more styling for the card spacing and shadows if needed
                            }}
                        />
                ))}
            </Box>
        </Container>
      );

};

export default CardPage;