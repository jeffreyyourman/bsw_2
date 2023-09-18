import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

function GameMatchupsCarousel({ games }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, games.games.length - 4));
  };

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr) => {
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours, 10);
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12; // if hours is 0, set it to 12
    return `${hours}:${minutes} ${amOrPm}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4">{'Week ' + (games.games[0].week || '')}</Typography>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <IconButton onClick={handlePrev}>
          <ChevronLeft />
        </IconButton>
        <div ref={carouselRef} style={{ overflow: 'hidden', display: 'flex', width: '1000px' }}>
          <div style={{ display: 'flex', transform: `translateX(-${currentIndex * 260}px)` }}>
            {games.games.map(game => (
              <div key={game.gameKey} style={{ width: '250px', margin: '0 5px' }}>
                <Card style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent style={{ flexGrow: 1 }}>
                    <Typography variant="h6">{game.visitorTeam.fullName}</Typography>
                    <Typography color="textSecondary">{game.visitorTeam.abbr}</Typography>
                    <Typography variant="h6">{game.homeTeam.fullName}</Typography>
                    <Typography color="textSecondary">{game.homeTeam.abbr}</Typography>
                    <Typography style={{ marginTop: '10px', textAlign: 'center' }}>
                      {formatDate(game.gameDate)}
                    </Typography>
                    <Typography style={{ marginTop: '10px', textAlign: 'center' }}>
                      {formatTime(game.gameTimeEastern)}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <IconButton onClick={handleNext}>
          <ChevronRight />
        </IconButton>
      </div>
    </div>
  );
}

export default GameMatchupsCarousel;
