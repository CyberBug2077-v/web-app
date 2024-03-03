import React from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { Card, CardContent, Typography, CardActions, Button, CardMedia } from '@mui/material';

const UserCard = ({ card, onSwipeLeft, onSwipeRight, onLike }) => {

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
        backgroundImage: 'linear-gradient(to right, #FF626E, #FFBE71)',
        borderRadius: '8px',
        color: 'black'
    };

    const dislikeButtonStyle = {
        backgroundImage: 'linear-gradient(to right, #4DB2CB, #67B26F)',
        borderRadius: '8px',
        color: 'black'
    };

  const handleLikeClick = () => {
    if (onLike && typeof onLike === 'function') {
      onLike(card); // Call the onLike function with the card's ID
    }
  };
  return (
    <animated.div {...bind()} style={{ x, touchAction: 'none' }}>
      <Card sx={{
          width: 180,
          height: 500,
          marginBottom: 2,

          boxShadow: 3,
          '&:hover': {
              boxShadow: 6,
          },
          borderRadius: '16px',
          overflow: 'hidden',
          color: 'white',
      }}>
            {card.avatarImage && (
                <CardMedia
                    component="img"
                    height="100"
                    image={card.avatarImage}
                    alt="User Avatar"
                    sx={{
                        width: '100%', // Makes sure the image is as wide as the card
                        objectFit: 'cover', // Keeps the aspect ratio, might crop the image if it doesn't fit
                    }}
                />
            )}
            {card.backgroundImage && (
                <CardMedia
                    component="img"
                    height="200"
                    image={card.backgroundImage}
                    imagePosition="center"
                    alt="User Background"
                />
            )}
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {card.userName || 'Unknown User'} 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {card.description}
                </Typography>
            </CardContent>
            <CardActions sx={{
                justifyContent: 'space-between',
                padding: '0 16px 8px',
            }}>
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
                    onClick={ handleLikeClick }
                    style={likeButtonStyle}
                    disabled={card.liked} // Disable the button if the card has been liked
                >
                    Like
                </Button>
            </CardActions>
        </Card>
        </animated.div>
    );
};

export default UserCard;
