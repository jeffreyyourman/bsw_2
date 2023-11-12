import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import axios from 'axios';
import { formatDate, formatTime } from '../../utils/date_format';



function GameMatchupsCarousel({ games, handleExcludeTeams, excludedTeams, setExcludedTeams }) {
  const [scoresDataLoading, setScoresDataLoading] = useState(null);
  const displayGameDetails = (game) => {
    const { competitors, odds, date, fullStatus } = game;


    const TeamCard = ({ team, score, odds }) => (
      <div
        onClick={() => handleExcludeTeams(team.abbreviation)}
        style={{
          cursor: 'pointer',
          opacity: excludedTeams.includes(team.abbreviation) ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={team.logo} alt={`${team.abbreviation} logo`} style={{ width: '40px', marginRight: '10px' }} />
          <span>{team.abbreviation}</span>
        </div>
        <div>
          {score && <span> {score}</span>}
          {!score && odds && <span> {odds}</span>}
        </div>
      </div>
    );

    const displayGameStatus = (fullStatus) => {
      if (fullStatus.type.completed) {
        return "Final";
      } else if (fullStatus.type.state === "in") {
        return "Live";

      } else if (fullStatus.type.state === "pre") {
        return "Pre Game";
      } else {
        return "Has not started";
      }
    };

    return (
      <>
        <div style={{
          borderBottom: '1px solid black',

        }}>
          {/* <div>{fullStatus.type.detail !== "Final" && formatDate(fullStatus.type.detail)}</div> */}

          {<div style={{
            fontSize: 14
          }}>{fullStatus.type.detail}</div>}
          {<div style={{
            fontSize: 14
          }}>{displayGameStatus(fullStatus)}</div>}
        </div>
        <CardContent style={{ paddingBottom: '8px' }}>
          <TeamCard team={competitors[0]} score={competitors[0].score} odds={odds && odds.awayTeamOdds && odds.awayTeamOdds.moneyLine} total={odds.overUnder} />
          <TeamCard team={competitors[1]} score={competitors[1].score} odds={odds && odds.homeTeamOdds && odds.homeTeamOdds.moneyLine} total={odds.overUnder} />
          <p>Game Total: {odds.overUnder}</p>
        </CardContent>
      </>
    );
  };




  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);



  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, games.length - 4));
  };


  if (scoresDataLoading) {
    return <h1>Loading</h1>
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <IconButton onClick={handlePrev}>
          <ChevronLeft />
        </IconButton>
        <div ref={carouselRef} style={{ overflow: 'hidden', display: 'flex', width: '100%' }}>
          <div style={{ display: 'flex', transform: `translateX(-${currentIndex * 260}px)` }}>
            {games.map((game, index) => {

              return <div key={`${index}_${game.gameKey}`} style={{ width: '250px', margin: '0 5px' }}>
                <Card
                  className="nfl-game-matchup-item"
                  style={{

                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    border: '1px solid #ededed',
                  }}>
                  <CardContent>
                    {displayGameDetails(game)}
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


// const getTeamLogo = (abbr) => `/img/teams/nfl/${abbr}.gif`;


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
  // const predictedScores = predictScore(spreadsData, totalsData);
  // console.log('predictedScores', predictedScores);
//  {/* <div style={{
//                     backgroundColor: '#f5f5f5',
//                     padding: '10px',
//                     textAlign: 'center',
//                     fontWeight: 'bold'
//                   }}>
//                     {formatDate(game.gameDate)} - {formatTime(game.gameTimeEastern)}
//                     <div>{scoreMatchup?.scores ? 'Live' : game?.score?.phase}</div>
//                   </div>
//                   <CardContent
//                     style={{
//                       flexGrow: 1,
//                       boxShadow: '0 2px 8px rgba(248, 248, 250, 0.06)',
//                     }}>

//                     <div
//                       onClick={() => { handleExcludeTeams(game.visitorTeam.abbr) }}
//                       style={{
//                         cursor: 'pointer',
//                         opacity: excludedTeams.includes(game.visitorTeam.abbr) ? 0.5 : 1,
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         marginBottom: '12px'
//                       }}
//                     >

//                       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
//                         <img
//                           src={getTeamLogo(game.visitorTeam.abbr)}
//                           alt={`${game.visitorTeam.abbr} logo`}
//                           style={{ width: '50px', marginRight: '8px' }}
//                         />
//                         <Typography
//                           color="textSecondary"
//                           style={{
//                             fontSize: '24px'
//                           }}
//                         >

//                           {game.visitorTeam.abbr}
//                         </Typography>
//                       </div>

//                       <div>
//                         {scoreMatchup?.scores ? scoreMatchup.scores[0].score : game?.score?.visitorTeamScore.pointTotal}

//                       </div>
//                     </div>

//                     <div
//                       onClick={() => { handleExcludeTeams(game.homeTeam.abbr) }}
//                       style={{
//                         cursor: 'pointer',
//                         opacity: excludedTeams.includes(game.homeTeam.abbr) ? 0.5 : 1,
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

//                         <img
//                           src={getTeamLogo(game.homeTeam.abbr)}
//                           alt={`${game.homeTeam.abbr} logo`}
//                           style={{ width: '50px', marginRight: '8px' }}
//                         />
//                         <Typography
//                           color="textSecondary"
//                           style={{
//                             fontSize: '24px'
//                           }}
//                         >

//                           {game.homeTeam.abbr}
//                         </Typography>
//                       </div>
//                       <div>

//                         {scoreMatchup?.scores ? scoreMatchup.scores[1].score : game?.score?.homeTeamScore.pointTotal}
//                       </div>
//                     </div>

//                   </CardContent> */}


// "video": {
//   "source": "espn",
//   "id": 38579538,
//   "headline": "DJ Moore goes off for 230 yards and 3 TDs in Bears' 1st win",
//   "caption": "DJ Moore tallies eight receptions, 230 yards and three touchdowns in the Bears' victory over the Commanders.",
//   "description": "DJ Moore tallies eight receptions, 230 yards and three touchdowns in the Bears' victory over the Commanders.",
//   "premium": false,
//   "ad": {
//     "sport": "nfl",
//     "bundle": "nfl_highlights"
//   },
//   "tracking": {
//     "sportName": "nfl",
//     "leagueName": "No League",
//     "coverageType": "Final Game Highlight",
//     "trackingName": "*UNPUB 10/7* COM_NFL Highlight (DJ Moore goes off for 230 yards and 3 TDs in Bears' win) 2023/10/05 ESHEET SOTFULL",
//     "trackingId": "dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag"
//   },
//   "cerebroId": "651f7f88be6ab312def4b4a2",
//   "pccId": "5577e369-f6c7-403a-8ccb-2cc2ff8c2533",
//   "lastModified": "2023-10-06T03:32:55Z",
//   "originalPublishDate": "2023-10-06T03:27:38Z",
//   "timeRestrictions": {
//     "embargoDate": "2023-10-06T03:27:38Z",
//     "expirationDate": "2023-10-08T03:27:38Z"
//   },
//   "deviceRestrictions": {
//     "type": "whitelist",
//     "devices": [
//       "desktop",
//       "settop",
//       "handset",
//       "tablet"
//     ]
//   },
//   "syndicatable": false,
//   "duration": 70,
//   "gameId": 401547457,

//   "links": {

//     "source": {
//       "mezzanine": {
//         "href": "https://media.video-origin.espn.com/espnvideo/2023/1005/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag.mp4"
//       },
//       "flash": {
//         "href": "https://media.video-cdn.espn.com/motion/2023/1005/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag.smil"
//       },
//       "hds": {
//         "href": "https://hds.video-cdn.espn.com/z/motion/2023/1005/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag_rel.smil/manifest.f4m"
//       },
//       "HLS": {
//         "href": "https://service-pkgespn.akamaized.net/opp/hls/espn/2023/1005/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/playlist.m3u8",
//         "HD": {
//           "href": "https://service-pkgespn.akamaized.net/opp/hls/espn/2023/1005/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/playlist.m3u8"
//         }
//       },
//       "HD": {
//         "href": "https://media.video-cdn.espn.com/motion/2023/1005/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag_720p30_2896k.mp4"
//       },
//       "full": {
//         "href": "https://media.video-cdn.espn.com/motion/2023/1005/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag_360p30_1464k.mp4"
//       },
//       "href": "https://media.video-cdn.espn.com/motion/2023/1005/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag/dm_231005_dm_231005_NFL_Bears_DJ_Moore_HL_pub2tag_360p30_1464k.mp4"
//     },

//   }
// },

// OddsAPI KEY - 0222b576b967a9d4d4a0ed3e91d70cce
// https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=0222b576b967a9d4d4a0ed3e91d70cce&regions=us&markets=h2h,spreads,totals&oddsFormat=american
// make a request matchup the team names and pass it through the predict score 
