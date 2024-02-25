import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

const UserCard = ({ user, onSwipeLeft, onSwipeRight }) => {

    // Initial values for animation
    const [{ x }, set] = useSpring(() => ({ x: 0 }));

    // Bind swipe event
    const bind = useDrag(({ down, movement: [mx], direction: [xDir], velocity }) => {
        const trigger = velocity > 0.2; // Swipe is triggered if velocity is greater than 0.2
        const dir = xDir < 0 ? 'left' : 'right'; // Determine direction of swipe
        if (!down && trigger) {
            if(dir === 'left') {
                onSwipeLeft(); // Call onSwipeLeft if swiped left
            } else {
                onSwipeRight(); // Call onSwipeRight if swiped right
            }
        }
        set({ x: down ? mx : 0 }); // Follow the finger position during swipe, reset on release
    });

    const likeButtonStyle = {
        backgroundImage: 'linear-gradient(to right, orange , pink)',
        borderRadius: '8px',
        color: 'white'
    };

    const dislikeButtonStyle = {
        backgroundImage: 'linear-gradient(to right, yellow, green)',
        borderRadius: '8px',
        color: 'white'
    };


    return (
        <animated.div {...bind()} style={{ x, touchAction: 'none' }}>
            <Card sx={{ 
                        maxWidth: 360,
                        height: '400px',
                        marginBottom: 2,
                        backgroundImage: `url(${process.env.PUBLIC_URL + '/assets/backgrounds/yourname.jpg'})`,
                        backgroundSize: 'cover', // Cover the entire card with the image
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '8px',
                        color: 'white',
                    }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: 'white' }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ color: 'white' }}>
                        {user.details}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button 
                        size="small" 
                        color="primary" 
                        onClick={onSwipeLeft}
                        style={dislikeButtonStyle}
                    >
                        Dislike
                    </Button>
                    <Button 
                        size="small" 
                        color="primary" 
                        onClick={onSwipeRight}
                        style={likeButtonStyle}
                    >
                        Like
                    </Button>
                </CardActions>
            </Card>
        </animated.div>
    );
};

export default UserCard;
