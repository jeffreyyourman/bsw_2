import * as React from "react";
import NbaDfsLayout from "../../../../../components/layouts/NbaDfsLayout";
import axios from 'axios'
import { Card, CardContent, Typography, IconButton } from '@mui/material';

const MatchupsPage = () => {


  const useLocal = true
  let baseUrl;
  if (process.env.NODE_ENV === 'development') {
    if (useLocal) {
      baseUrl = 'http://localhost:3000'
    } else {

      baseUrl = 'https://bsw-be-api.onrender.com'
    }
  } else {
    baseUrl = 'https://bsw-be-api.onrender.com';
  }


  const [gameMatchups, setGameMatchups] = React.useState([]);
  const [loadingGameMatchups, setLoadingGameMatchups] = React.useState(false);

  React.useEffect(() => {
    fetchGameMatchups()
  }, [])
  const fetchGameMatchups = async () => {
    setLoadingGameMatchups(true)
    try {
      const response = await axios.get(`${baseUrl}/dfs-projections/nba/espn-scoreboard`);

      // console.log('get game matchups slate lists - response - ', response.data.data.sports[0].leagues[0].events);
      if (Object.keys(response.data).length === 0) {
        setGameMatchups([]);
      } else {
        setGameMatchups(response.data.data.sports[0].leagues[0].events);
      }
      setLoadingGameMatchups(false)
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
      setLoadingGameMatchups(false)
    }
  };

  if (gameMatchups.length === 0) {
    return <p>No Matchups</p>
  }
  if (loadingGameMatchups) {
    return <p>Loading...</p>
  }


  const displayGameDetails = (game) => {
    const { competitors, odds, date, fullStatus } = game;


    const TeamCard = ({ team, score, odds }) => (
      <div
        // onClick={() => handleExcludeTeams(team.abbreviation)}
        style={{
          cursor: 'pointer',
          // opacity: excludedTeams.includes(team.abbreviation) ? 0.5 : 1,
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

  }


  return (

    <NbaDfsLayout>
      <div style={{ padding: '16px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {gameMatchups.map((game, index) => {

            return <div key={`${index}_${game.gameKey}`} style={{ width: '300px', margin: '8px' }}>
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
    </NbaDfsLayout>
  )
}

export default MatchupsPage;
