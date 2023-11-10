import * as React from "react";
import NbaDfsLayout from "../../../../../components/layouts/NbaDfsLayout";
import axios from 'axios'
import './oddsStyles.css';
const OddsPage = () => {
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

  console.log('gameMatchups', gameMatchups);

  return (
    <NbaDfsLayout>
      <div
        className="playerGroupLeftSideWrapper"
        style={{
          margin: 16,
          padding: 16,
          backgroundColor: 'white',
          borderRadius: '8px', // optional: adds rounded corners
          boxShadow: '0 2px 8px rgba(26, 24, 27, 0.1)', // subtle shadow
        }}
      >
        <table className="styledTable">
          <thead>
            <tr>
              <th>Team</th>
              <th>Record</th>
              <th>MONEYLINE</th>
              <th>SPREAD</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {gameMatchups.map((game, index) => (
              <React.Fragment key={game.key}>
                <tr className={index % 2 === 0 ? "evenRow" : "oddRow"}>
                  <td>{game.odds.awayTeamOdds.team.abbreviation}</td>
                  <td>{game.competitors[0].record}</td>
                  <td>{game.odds.awayTeamOdds.moneyLine}</td>
                  <td>{game.odds.awayTeamOdds.spreadOdds}</td>
                  <td rowSpan="2">{game.odds.overUnder}</td>
                </tr>
                <tr className={index % 2 === 0 ? "evenRow" : "oddRow"}>
                  <td>{game.odds.homeTeamOdds.team.abbreviation}</td>
                  <td>{game.competitors[1].record}</td>
                  <td>{game.odds.homeTeamOdds.moneyLine}</td>
                  <td>{game.odds.homeTeamOdds.spreadOdds}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </NbaDfsLayout>
  );

}

export default OddsPage;
