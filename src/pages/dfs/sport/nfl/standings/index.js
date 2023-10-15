import React, { useEffect, useState, useeffect } from "react";
import NflDfsLayout from "../../../../../components/layouts/NflDfsLayout";
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
  const [tabValue, setTabValue] = useState(0); // Default to "Division View"
  const [espnDivisionStandings, setEspnDivisionStandings] = useState(null)
  const [espnStandingsLoading, setEspnStandingsLoading] = useState(false)
  const [espnConfStandings, setEspnConfStandings] = useState(null)
  const getEspnStandings = (abbr) => `/mockJson/nfl/2023-espn-standings.json`;

  useEffect(() => {
    fetchEspnStandings();
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  const fetchEspnStandings = async () => {
    setEspnStandingsLoading(true)
    const getEspnStandingsRes = getEspnStandings()

    try {
      const response = await axios.get(getEspnStandingsRes);
      console.log('response', response);

      if (Object.keys(response.data).length === 0) {
        // fetchPlayerSlateDataSet('Main')
        setEspnDivisionStandings([]);
      } else {
        setEspnDivisionStandings(response.data);
        let conferenceView = response.data.children.map(conference => {
          return {
            name: conference.name,
            teams: conference.children.flatMap(division => division.standings.entries)
          };
        });

        setEspnConfStandings(conferenceView);
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
    <NflDfsLayout>
      <div>

        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Division View" />
          <Tab label="Conference View" />
        </Tabs>

        {tabValue === 0 && (
          // Division View
          <div>
            <h1>{espnDivisionStandings.name} Standings Season</h1>
            {espnDivisionStandings.children.map(conference => (
              <div key={conference.id}>
                <h1 style={{
                  fontWeight: 'bold',
                  marginTop: '24px',
                  // marginBottom: '16px',
                }}>{conference.name}</h1>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                }}>
                  {conference.children.map(division => (
                    <div
                      style={{
                        overflowX: 'auto', 
                        width: '600px',
                        maxWidth: '600px',
                        // maxWidth: '100%',
                        marginRight:'16px',
                      }}
                      key={division.id}>
                      <h3 style={{
                        fontWeight: 'bold',
                        marginTop: '8px',
                        marginBottom: '16px',
                      }}>{division.name} Standings:</h3>
                      <div style={{ overflowX: 'auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <TableContainer component={Paper} style={{ height: '600px', overflowY: 'auto' }}>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                {/* <TableCell style={{ position: 'sticky', left: 0, zIndex: 20, background: '#fff' }}>
                                  Team Logo
                                </TableCell> */}
                                <TableCell>Team Name</TableCell>
                                <TableCell>W</TableCell>
                                <TableCell>L</TableCell>
                                <TableCell>T</TableCell>
                                <TableCell>PCT</TableCell>
                                <TableCell>GB</TableCell>
                                <TableCell>Point Diff</TableCell>
                                <TableCell>Playoff Seed</TableCell>
                                <TableCell>Division Record</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {division.standings.entries.map(team => (
                                <TableRow key={team.team.id}>
                                  {/* <TableCell style={{ position: 'sticky', left: 0, zIndex: 2, background: '#fff' }}>
                                    <img src={team.team.logos[0].href} alt={team.team.shortDisplayName} width="50" height="50" />
                                  </TableCell> */}
                                  <TableCell style={{ display: 'flex', alignItems: "center" }}><img src={team.team.logos[0].href} alt={team.team.shortDisplayName} width="50" height="50" /> <span style={{ marginLeft: '8px' }}>{team.team.displayName}</span></TableCell>
                                  <TableCell>{team.stats.find(stat => stat.name === 'wins').displayValue}</TableCell>
                                  <TableCell>{team.stats.find(stat => stat.name === 'losses').displayValue}</TableCell>
                                  <TableCell>{team.stats.find(stat => stat.name === 'ties').displayValue}</TableCell>
                                  <TableCell>{team.stats.find(stat => stat.name === 'winPercent').displayValue}</TableCell>
                                  <TableCell>{team.stats.find(stat => stat.name === 'gamesBehind').displayValue}</TableCell>
                                  <TableCell>{team.stats.find(stat => stat.name === 'pointDifferential').displayValue}</TableCell>
                                  <TableCell>{team.stats.find(stat => stat.name === 'playoffSeed').displayValue}</TableCell>
                                  <TableCell>{team.stats.find(stat => stat.name === 'divisionRecord').displayValue}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tabValue === 1 && (
          // Conference View
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly'

          }}>
            {espnConfStandings.map(conference => (
              <div key={conference.name} style={{ marginRight: '4px' }}>
                <h2
                  style={{
                    fontWeight: 'bold',
                    marginTop: '24px',
                    marginBottom: '16px',
                  }}
                >{conference.name}</h2>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <TableContainer component={Paper} style={{ height: '520px', overflowY: 'auto' }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ position: 'sticky', left: 0, zIndex: 20, background: '#fff' }}>
                            Team Logo
                          </TableCell>
                          <TableCell>Team Name</TableCell>
                          <TableCell>W</TableCell>
                          <TableCell>L</TableCell>
                          <TableCell>T</TableCell>
                          <TableCell>PCT</TableCell>
                          {/* <TableCell>GB</TableCell> */}
                          {/* <TableCell>Point Diff</TableCell> */}
                          <TableCell>Playoff Seed</TableCell>
                          <TableCell>Division Record</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {conference.teams.map(team => (
                          <TableRow key={team.team.id}>
                            <TableCell style={{ position: 'sticky', left: 0, zIndex: 2, background: '#fff' }}>
                              <img src={team.team.logos[0].href} alt={team.team.shortDisplayName} width="50" height="50" />
                            </TableCell>
                            <TableCell>{team.team.displayName}</TableCell>
                            <TableCell>{team.stats.find(stat => stat.name === 'wins').displayValue}</TableCell>
                            <TableCell>{team.stats.find(stat => stat.name === 'losses').displayValue}</TableCell>
                            <TableCell>{team.stats.find(stat => stat.name === 'ties').displayValue}</TableCell>
                            <TableCell>{team.stats.find(stat => stat.name === 'winPercent').displayValue}</TableCell>
                            {/* <TableCell>{team.stats.find(stat => stat.name === 'gamesBehind').displayValue}</TableCell> */}
                            {/* <TableCell>{team.stats.find(stat => stat.name === 'pointDifferential').displayValue}</TableCell> */}
                            <TableCell>{team.stats.find(stat => stat.name === 'playoffSeed').displayValue}</TableCell>
                            <TableCell>{team.stats.find(stat => stat.name === 'divisionRecord').displayValue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
    </NflDfsLayout>
  )
};

export default StandingsPage;
