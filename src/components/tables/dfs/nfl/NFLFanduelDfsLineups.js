import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
// import Button from "@mui/material/Button";
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
  Box,
  TextField,
} from '@mui/material';
import { CSVLink } from "react-csv";

import lodashOrderBy from 'lodash/orderBy';

export default function NFLFanduelDfsLineups(props) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [startLine, setStartLine] = useState(null);
  const [endLine, setEndLine] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('totalfppg');
  const initialSavedLineups = props.lineups.lineups;
  const [savedLineups, setSaveLineups] = useState([]);
  const [deletedLineups, setDeletedLineups] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const [sortTopPlayers, setSortTopPlayers] = useState(props.topPlayers);
  
  useEffect(() => {
    setSaveLineups(initialSavedLineups)
  }, [initialSavedLineups])
  const handleChangeTab = (newValue) => {
    setSelectedTab(newValue);
  };

  const handleCheckboxChange = (lineup, isChecked) => {
    let newSaveLineups, newDeletedLineups;

    if (isChecked) {
      newSaveLineups = [...savedLineups, lineup];
      newDeletedLineups = deletedLineups.filter(item => item !== lineup);
    } else {
      newDeletedLineups = [...deletedLineups, lineup];
      newSaveLineups = savedLineups.filter(item => item !== lineup);
    }

    setSaveLineups(newSaveLineups);
    setDeletedLineups(newDeletedLineups);

    // Combine both saved and deleted lineups to get the current set of lineups
    const currentLineups = [...newSaveLineups, ...newDeletedLineups];

    const { topPlayers, topTeams } = props.generateTopPlayersAndTeams(newSaveLineups);
    props.setTopPlayers(topPlayers);
    props.setTopTeams(topTeams);
  };

  const handleBulkDelete = () => {
    const start = parseInt(startLine, 10);
    const end = parseInt(endLine, 10);

    const newLineups = props.lineups.lineups.filter((_, index) => index < start || index > end);

    const updatedLineupsObj = {
      ...props.lineups,
      lineups: newLineups
    };

    props.setLineups(updatedLineupsObj);

    // Recalculate top players and teams based on the new set of lineups
    const { topPlayers, topTeams } = props.generateTopPlayersAndTeams(newLineups);
    props.setTopPlayers(topPlayers);
    props.setTopTeams(topTeams);
  };



  const handleSortRequest = (property) => {
    if (orderBy === property) { // If the same header is clicked
      if (order === 'desc') {
        setOrder('asc');
      } else if (order === 'asc') {
        setOrder('default');
      } else if (order === 'default') {
        setOrder('desc');
      }
    } else { // If a different header is clicked
      setOrder('desc');
      setOrderBy(property);
    }
  };


  let sortedLineups;
  if (order === 'default') {
    sortedLineups = props.lineups.lineups;
  } else {
    sortedLineups = lodashOrderBy(props.lineups.lineups, [orderBy], [order]);
  }


  const exportLineupsToUpload = () => {

    const csvData = savedLineups.map(lineup => {
      return [
        lineup.totalfppg.toFixed(2),
        lineup.totalPassTds.toFixed(2),
        lineup.totalPassInterceptions.toFixed(2),
        lineup.totalPassYards.toFixed(2),
        lineup.totalRushAtt.toFixed(2),
        lineup.totalRushTds.toFixed(2),
        lineup.totalRushYds.toFixed(2),
        lineup.totalReceptions.toFixed(2),
        lineup.totalRecYds.toFixed(2),
        lineup.totalRecTgts.toFixed(2),
        lineup.totalRecTds.toFixed(2),
        lineup.totalTds.toFixed(2),
        lineup.totalEverything.toFixed(2),
        ...lineup.players.map(player => player.playerId)
      ];
    });

    const headers = [
      'totalfppg',
      'totalPassTds',
      'totalPassInterceptions',
      'totalPassYards',
      'totalRushAtt',
      'totalRushTds',
      'totalRushYds',
      'totalReceptions',
      'totalRecYds',
      'totalRecTgts',
      'totalRecTds',
      'totalTds',
      'totalEverything',
      "QB",
      "RB",
      "RB",
      "WR",
      "WR",
      "WR",
      "TE",
      "FLEX",
      "DEF"];

    // Since csvData already contains arrays structured the way we want, 
    // we can just spread it into the return array after the headers.
    return [headers, ...csvData];
  };


  const handleFilterPlayers = (text) => {
    console.log('text',text.target.value);
    setSearchTerm(text.target.value.toLowerCase())
    let searchTextLowerCase = text.target.value.toLowerCase();
    const filterName = props.topPlayers.filter((player) => {
      let newPlayerName = player.playerName.toLowerCase();
      if (newPlayerName.includes(searchTextLowerCase)) {
        return player;
      }
    });
    if (filterName.length !== 0) {
      setSortTopPlayers(filterName);
    } else {
      setSortTopPlayers(props.topPlayers);
    }
  };
  


  

  return (
    <div>

      <div style={{ padding: "15px", height: "60vh" }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: '24px',
          marginBottom: '24px',
        }}>
          <CSVLink
            style={{ marginRight: 8 }}
            asyncOnClick={true}
            data={exportLineupsToUpload()}

          >
            Export lineups
          </CSVLink>

          <input
            type="number"
            style={{ marginRight: 8 }}
            value={startLine || ""}
            onChange={e => setStartLine(e.target.value)}
            placeholder="Start Lineup"
          />
          <input
            type="number"
            style={{ marginRight: 8 }}
            value={props.lineups.lineups.length}
            maxLength={props.lineups.lineups.length}
            onChange={e => setEndLine(e.target.value)}
            placeholder="End Lineup"
          />
          <button onClick={handleBulkDelete}>Bulk Delete</button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
          <Box sx={{ width: '22%', marginRight: '16px' }}>
            <div
              style={{
                display: 'flex',
                marginTop: '8px',
                flexDirection: 'row',
              }}
            >

              <p
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                  borderBottom: selectedTab === 0 ? '2px solid #00203d' : 'none',
                  color: selectedTab === 0 ? '#00203d' : '#888',
                  fontWeight: selectedTab === 0 ? 'bold' : 'normal'
                }}
                onClick={() => {
                  handleChangeTab(0)
                }}>Top Players</p>

              <p
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                  marginLeft: 12,
                  borderBottom: selectedTab === 1 ? '2px solid #00203d' : 'none',
                  color: selectedTab === 1 ? '#00203d' : '#888',
                  fontWeight: selectedTab === 1 ? 'bold' : 'normal'
                }}
                onClick={() => {
                  handleChangeTab(1)
                }}>Top Teams</p>

            </div>

            {selectedTab === 0 && (
              <div>
                <p style={{ marginTop: 8, marginBottom: 16 }}>{props.topPlayers.length} Player(s) used</p>
                <TextField
                style={{ marginBottom: 16 }}
                label="Search Players"
                variant="outlined"
                value={searchTerm}
                onChange={handleFilterPlayers}
                fullWidth
              />
                <div style={{
                  height: '350px',
                  overflowY: 'auto'
                }}>
                  {sortTopPlayers
                    .sort((a, b) => b.totalAmt - a.totalAmt)
                    .map((topPlayer) => (
                      <div
                        style={{
                          marginBottom: '6px'
                        }}
                        key={topPlayer.playerName}>
                        <span>{topPlayer.playerName} </span>
                        <span>- {topPlayer.totalAmt} </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {selectedTab === 1 && (
              <div>
                {/* <h2 style={{ fontWeight: 'bold', marginTop: 16 }}>Top Teams</h2> */}
                <p style={{ marginTop: 8, marginBottom: 16 }}>{props.topTeams.length} Teams(s) used</p>
                <div style={{
                  height: '350px',
                  overflowY: 'auto'
                }}>
                  {props.topTeams
                    .sort((a, b) => b.totalAmt - a.totalAmt)
                    .map((topTeam) => (
                      <div
                        style={{
                          marginBottom: '6px'
                        }}
                        key={topTeam.teamName}>
                        <span>{topTeam.teamName} </span>
                        <span>{topTeam.totalAmt} </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </Box>
          <div style={{ overflowX: 'auto', width: '100%' }}>

            <TableContainer component={Paper} style={{ height: '520px', overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ position: 'sticky', left: 0, top: 0, zIndex: 20, background: '#fff' }}>
                      Use
                    </TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>
                      <TableSortLabel
                        active={orderBy === 'totalfppg'}
                        direction={order}
                        onClick={() => handleSortRequest('totalfppg')}
                      >
                        Total Projected
                      </TableSortLabel>
                    </TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>


                      <TableSortLabel
                        active={orderBy === 'lineup_salary'}
                        direction={order}
                        onClick={() => handleSortRequest('lineup_salary')}
                      >
                        Total Salary


                      </TableSortLabel>
                    </TableCell>
                    {/* <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>


                      <TableSortLabel
                        active={orderBy === 'totalTds'}
                        direction={order}
                        onClick={() => handleSortRequest('totalTds')}
                      >
                        Total Projected Touchdowns


                      </TableSortLabel>
                    </TableCell> */}
                    {/* <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>


                      <TableSortLabel
                        active={orderBy === 'totalEverything'}
                        direction={order}
                        onClick={() => handleSortRequest('totalEverything')}
                      >
                        Total All Stats


                      </TableSortLabel>
                    </TableCell> */}
                    {/* <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>


                      <TableSortLabel
                        active={orderBy === 'totalRecTds'}
                        direction={order}
                        onClick={() => handleSortRequest('totalRecTds')}
                      >
                        totalRecTds


                      </TableSortLabel>
                    </TableCell> */}
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>

                      QB</TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>

                      RB</TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>

                      RB</TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>

                      WR</TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>

                      WR</TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>

                      WR</TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>

                      TE</TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>

                      Flex</TableCell>
                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff' }}>

                      Def</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedLineups.map((lineup, index) => {
                    return <TableRow key={index}>
                      <TableCell style={{ position: 'sticky', left: 0, zIndex: 2, background: '#fff' }}>
                        <input
                          type="checkbox"
                          checked={savedLineups.includes(lineup)}
                          onChange={(e) => handleCheckboxChange(lineup, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>{lineup.lineup_points}</TableCell>
                      <TableCell>{lineup.lineup_salary}</TableCell>
                      {/* <TableCell>{lineup.totalTds.toFixed(2)}</TableCell>
                      <TableCell>{lineup.totalEverything.toFixed(2)}</TableCell>
                      <TableCell>{lineup.totalRecTds.toFixed(2)}</TableCell> */}
                      {lineup.players.map((player, playerIndex) => (
                        <TableCell key={playerIndex}>{player.playerName}</TableCell>
                      ))}
                    </TableRow>
                  })}
                </TableBody>
              </Table>
            </TableContainer>


          </div>
        </div>
      </div>
    </div>
  );
}

