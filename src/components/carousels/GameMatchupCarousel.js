import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

function GameMatchupsCarousel({ games, handleExcludeTeams, excludedTeams, setExcludedTeams }) {


  const getTeamLogo = (abbr) => `/img/teams/nfl/${abbr}.gif`;

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const sortedGames = games.games.sort((a, b) => {
    const dateA = new Date(a.gameTime);
    const dateB = new Date(b.gameTime);
    return dateA - dateB;
  });


  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, games.games.length - 4));
  };

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatTime = (timeStr) => {
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours, 10);
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours || 12; // if hours is 0, set it to 12
    return `${hours}:${minutes} ${amOrPm} ET`;
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4">{'Week ' + (games.games[0].week || '')}</Typography>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <IconButton onClick={handlePrev}>
          <ChevronLeft />
        </IconButton>
        <div ref={carouselRef} style={{ overflow: 'hidden', display: 'flex', width: '100%' }}>
          <div style={{ display: 'flex', transform: `translateX(-${currentIndex * 260}px)` }}>
            {sortedGames.map(game => (
              <div key={game.gameKey} style={{ width: '250px', margin: '0 5px' }}>
                <Card style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '8px',
                  border: '1px solid #ededed',
                }}>
                  <div style={{
                    backgroundColor: '#f5f5f5', // example gray background, modify as needed
                    padding: '10px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {formatDate(game.gameDate)} - {formatTime(game.gameTimeEastern)}
                  </div>
                  <CardContent
                    style={{
                      flexGrow: 1,
                      boxShadow: '0 2px 8px rgba(248, 248, 250, 0.06)',
                    }}>

                    <div
                      onClick={() => { handleExcludeTeams(game.visitorTeam.abbr) }}
                      style={{
                        cursor: 'pointer',
                        opacity: excludedTeams.includes(game.visitorTeam.abbr) ? 0.5 : 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}
                    >
                      <img
                        src={getTeamLogo(game.visitorTeam.abbr)}
                        alt={`${game.visitorTeam.abbr} logo`}
                        style={{ width: '50px', marginRight: '8px' }}
                      />
                      {/* <Typography variant="h6">{game.visitorTeam.fullName}</Typography> */}
                      <Typography
                        color="textSecondary"
                        style={{
                          fontSize: '24px'
                        }}
                      >

                        {game.visitorTeam.abbr}
                      </Typography>
                    </div>

                    <div
                      onClick={() => { handleExcludeTeams(game.homeTeam.abbr) }}
                      style={{
                        cursor: 'pointer',
                        opacity: excludedTeams.includes(game.homeTeam.abbr) ? 0.5 : 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={getTeamLogo(game.homeTeam.abbr)}
                        alt={`${game.homeTeam.abbr} logo`}
                        style={{ width: '50px', marginRight: '8px' }}
                      />
                      {/* <Typography variant="h6">{game.homeTeam.fullName}</Typography> */}
                      <Typography
                        color="textSecondary"
                        style={{
                          fontSize: '24px'
                        }}
                      >

                        {game.homeTeam.abbr}
                      </Typography>
                    </div>
                  
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
