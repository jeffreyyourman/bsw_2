import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import axios from 'axios';
// OddsAPI KEY - 0222b576b967a9d4d4a0ed3e91d70cce
// https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=0222b576b967a9d4d4a0ed3e91d70cce&regions=us&markets=h2h,spreads,totals&oddsFormat=american
// make a request matchup the team names and pass it through the predict score 

function predictScore(spreads, totals) {
  // Get the spread for the teams
  const favoriteTeam = spreads.outcomes.find(outcome => outcome.point < 0);
  const underdogTeam = spreads.outcomes.find(outcome => outcome.point > 0);

  // Calculate half the spread
  const halfSpread = Math.abs(favoriteTeam.point) / 2;

  // Starting with a midpoint total
  const midpointTotal = totals.outcomes[0].point / 2;

  // Calculate the scores
  const favoriteScore = midpointTotal + halfSpread;
  const underdogScore = midpointTotal - halfSpread;

  return {
    awayTeam: favoriteScore,
    homeTeam: underdogScore,
  };
}

const spreadsData = {
  "key": "spreads",
  "last_update": "2023-09-25T23:06:56Z",
  "outcomes": [
    {
      "name": "Philadelphia Eagles",
      "price": -110,
      "point": -6.0
    },
    {
      "name": "Tampa Bay Buccaneers",
      "price": -110,
      "point": 6.0
    }
  ]
};

const totalsData = {
  "key": "totals",
  "last_update": "2023-09-25T23:06:56Z",
  "outcomes": [
    {
      "name": "Over",
      "price": -112,
      "point": 44.0
    },
    {
      "name": "Under",
      "price": -108,
      "point": 44.0
    }
  ]
};


function GameMatchupsCarousel({ games, handleExcludeTeams, excludedTeams, setExcludedTeams }) {
  // console.log('games.games', games.games);
  const [oddsData, setOddsData] = useState(null);
  const [scoresData, setScoresData] = useState(null);
  const [scoresDataLoading, setScoresDataLoading] = useState(null);

  // useEffect(() => {
  //   setScoresDataLoading(true)

  //   axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=0222b576b967a9d4d4a0ed3e91d70cce&regions=us&markets=h2h,spreads,totals&oddsFormat=american')
  //     .then(oddsResp => {
  //       // console.log('oddsResp.data', oddsResp.data);
  //       axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?daysFrom=2&apiKey=0222b576b967a9d4d4a0ed3e91d70cce')
  //         .then(scoresResp => {
  //           console.log('scoresResp.data', scoresResp.data);
  //           // let tempData;
  //           // const matchingObjects = games.games.filter(obj1 =>
  //           //   scoresResp.data.find(obj2 => obj1.home_team
  //           //     === obj2.homeDisplayName)
  //           // );

  //           // console.log(matchingObjects);
  //           setOddsData(oddsResp.data);
  //           setScoresData(scoresResp.data);
  //           setScoresDataLoading(false)
  //         })
  //         .catch(error => {
  //           setScoresDataLoading(false)
  //           console.error("There was an error fetching the odds data:", error);
  //         });


  //     })
  //     .catch(error => {
  //       console.error("There was an error fetching the odds data:", error);
  //     });
  // }, []);
  const predictedScores = predictScore(spreadsData, totalsData);
  // console.log('predictedScores', predictedScores);

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
  if (scoresDataLoading) {
    return <h1>Loading</h1>
  }
  // if (!scoresData) {
  //   return <h1>no scores data</h1>
  // }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4">{'Week ' + (games.games[0].week || '')}</Typography>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <IconButton onClick={handlePrev}>
          <ChevronLeft />
        </IconButton>
        <div ref={carouselRef} style={{ overflow: 'hidden', display: 'flex', width: '100%' }}>
          <div style={{ display: 'flex', transform: `translateX(-${currentIndex * 260}px)` }}>
            {sortedGames.map(game => {
              let scoreMatchup;

              // let scoreMatchup = scoresData.find(score => {
              //   if (!game?.score?.phase && score.away_team === game.visitorDisplayName) {
              //     return score
              //   }
              // })

              return <div key={game.gameKey} className="nfl-game-matchup-item" style={{ width: '250px', margin: '0 5px' }}>
                <Card style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  border: '1px solid #ededed',
                }}>
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '10px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {formatDate(game.gameDate)} - {formatTime(game.gameTimeEastern)}
                    <div>{scoreMatchup?.scores ? 'Live' : game?.score?.phase}</div>
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
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}
                    >

                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <img
                          src={getTeamLogo(game.visitorTeam.abbr)}
                          alt={`${game.visitorTeam.abbr} logo`}
                          style={{ width: '50px', marginRight: '8px' }}
                        />
                        <Typography
                          color="textSecondary"
                          style={{
                            fontSize: '24px'
                          }}
                        >

                          {game.visitorTeam.abbr}
                        </Typography>
                      </div>

                      <div>
                        {scoreMatchup?.scores ? scoreMatchup.scores[0].score : game?.score?.visitorTeamScore.pointTotal}

                      </div>
                    </div>

                    <div
                      onClick={() => { handleExcludeTeams(game.homeTeam.abbr) }}
                      style={{
                        cursor: 'pointer',
                        opacity: excludedTeams.includes(game.homeTeam.abbr) ? 0.5 : 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                        <img
                          src={getTeamLogo(game.homeTeam.abbr)}
                          alt={`${game.homeTeam.abbr} logo`}
                          style={{ width: '50px', marginRight: '8px' }}
                        />
                        <Typography
                          color="textSecondary"
                          style={{
                            fontSize: '24px'
                          }}
                        >

                          {game.homeTeam.abbr}
                        </Typography>
                      </div>
                      <div>

                        {scoreMatchup?.scores ? scoreMatchup.scores[1].score : game?.score?.homeTeamScore.pointTotal}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </div>
            })}
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
