import React, { useEffect, useState, useeffect } from "react";
import NbaDfsLayout from "../../../../../components/layouts/NbaDfsLayout";
// import { SignedIn, SignedOut, UserButton, useClerk, useAuth } from "@clerk/clerk-react";
import axios from 'axios';
import {
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Tabs,
  Tab,
  Box
} from '@mui/material';
const StandingsPage = () => {
  const [espnDivisionStandings, setEspnDivisionStandings] = useState(null);
  const [espnStandingsLoading, setEspnStandingsLoading] = useState(false);
  const [orderDirection, setOrderDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('team');

  useEffect(() => {
    fetchEspnStandings();
  }, []);

  // Sorting function
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  // Function to sort data
  const sortData = (array) => {
    return array.sort((a, b) => {
      console.log('array', array);
      if (orderBy === 'team') {
        return orderDirection === 'asc'
          ? a.team.displayName.localeCompare(b.team.displayName)
          : b.team.displayName.localeCompare(a.team.displayName);
      } else {
        // Since the stats are strings, convert them to numbers for comparison
        const aStat = a.stats.find(stat => stat.name === orderBy);
        const bStat = b.stats.find(stat => stat.name === orderBy);
        const valA = aStat ? parseInt(aStat.value) : 0;
        const valB = bStat ? parseInt(bStat.value) : 0;
        return orderDirection === 'asc' ? valA - valB : valB - valA;
      }
    });
  };

  const fetchEspnStandings = async () => {
    setEspnStandingsLoading(true)
    // const getStandings = getStandingsJson()

    try {
      const response = await axios.get('https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings?region=us&lang=en&contentorigin=espn&type=0&level=1&sort=winpercent%3Adesc%2Cwins%3Adesc%2Cgamesbehind%3Aasc');
      // const response = await axios.get(getStandings);
      console.log('response', response);

      if (Object.keys(response.data).length === 0) {
        // fetchPlayerSlateDataSet('Main')
        setEspnDivisionStandings([]);
      } else {
        setEspnDivisionStandings(response.data);

      }
      setEspnStandingsLoading(false)
    } catch (error) {
      setEspnStandingsLoading(false)
      console.error("Error fetching the JSON data:", error);
    }
  };

  if (espnStandingsLoading) {
    return <h1>Loading Standings...</h1>
  }
  if (!espnDivisionStandings) {
    return <h1>No Standings</h1>
  }
  if (espnDivisionStandings.length === 0) {
    return <h1>No standings</h1>
  }
  // const clerk = useClerk();
  // const { getToken, isLoaded, isSignedIn , signOut} = useAuth();
  // // console.log('getToken',getToken())
  // console.log('isLoaded',isLoaded)
  console.log('espnDivisionStandings', espnDivisionStandings)
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
              <th>
                <TableSortLabel
                  active={orderBy === 'team'}
                  direction={orderBy === 'team' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('team')}
                >
                  Team
                </TableSortLabel>
              </th>
              <th>
                <TableSortLabel
                  active={orderBy === 'wins'}
                  direction={orderBy === 'wins' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('wins')}
                >
                  W
                </TableSortLabel>
              </th>
              <th>
                <TableSortLabel
                  active={orderBy === 'losses'}
                  direction={orderBy === 'losses' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('losses')}
                >
                  L
                </TableSortLabel>
              </th>
              <th>
                <TableSortLabel
                  active={orderBy === 'pct'}
                  direction={orderBy === 'pct' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('pct')}
                >
                  PCT
                </TableSortLabel>
              </th>
              <th>
                <TableSortLabel
                  active={orderBy === 'gb'}
                  direction={orderBy === 'gb' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('gb')}
                >
                  GB
                </TableSortLabel>
              </th>
              <th>Home</th>
              <th>Away</th>
              <th>Div</th>
              <th>Conf</th>
              <th>
                <TableSortLabel
                  active={orderBy === 'avgPointsFor'}
                  direction={orderBy === 'avgPointsFor' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('avgPointsFor')}
                >
                  PPG
                </TableSortLabel>
              </th>
              <th>OPP PPG</th>
              <th>DIFF</th>
              <th>Streak</th>
              <th>
                <TableSortLabel
                  active={orderBy === 'l10'}
                  direction={orderBy === 'l10' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('l10')}
                >
                  L10
                </TableSortLabel>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortData(espnDivisionStandings.standings.entries).map((team, index) => {
              // {espnDivisionStandings.standings.entries.map((team, index) => {
              console.log('team logos', team.team.logos)
              return <React.Fragment key={team.key}>
                <tr className={index % 2 === 0 ? "evenRow" : "oddRow"}>
                  <td style={{ display: 'flex', alignItems: 'center' }}>
                    <img style={{ width: '50px', marginRight: '8px' }} src={team.team.logos[0].href} />
                    {team.team.displayName}
                  </td>
                  <td>{team.stats[11].displayValue}</td>
                  <td>{team.stats[6].displayValue}</td>
                  <td>{team.stats[10].displayValue}</td>
                  <td>{team.stats[4].displayValue}</td>
                  <td>{team.stats[13].displayValue}</td>
                  <td>{team.stats[14].displayValue}</td>
                  <td>{team.stats[15].displayValue}</td>
                  <td>{team.stats[16].displayValue}</td>
                  <td>{team.stats[1].displayValue}</td>
                  <td>{team.stats[0].displayValue}</td>
                  <td>{team.stats[2].displayValue}</td>
                  <td>{team.stats[9].displayValue}</td>
                  <td>{team.stats[17].displayValue}</td>
                </tr>
              </React.Fragment>
            })}
          </tbody>
        </table>



      </div>
    </NbaDfsLayout>
  )
};

export default StandingsPage;
