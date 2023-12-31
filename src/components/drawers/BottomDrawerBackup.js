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
  Box
} from '@mui/material';
import { CSVLink } from "react-csv";

import lodashOrderBy from 'lodash/orderBy';

export default function TemporaryDrawer(props) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [startLine, setStartLine] = useState(null);
  const [endLine, setEndLine] = useState(null);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('totalfppg');
  const initialSavedLineups = props.lineups.lineups;
  const [savedLineups, setSaveLineups] = useState([]);
  const [deletedLineups, setDeletedLineups] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    setSaveLineups(initialSavedLineups)
  }, [initialSavedLineups])
  const handleChangeTab = (newValue) => {
    console.log('newvalue', newValue);
    setSelectedTab(newValue);
  };

  // ... other functions ...
  // console.log('savedLineups', savedLineups);

  // console.log('deletedLineups', deletedLineups);
  // const handleCheckboxChange = (lineup, isChecked) => {
  //   if (isChecked) {
  //     setSaveLineups(prev => [...prev, lineup]);
  //     setDeletedLineups(prev => prev.filter(item => item !== lineup));
  //   } else {
  //     setDeletedLineups(prev => [...prev, lineup]);
  //     setSaveLineups(prev => prev.filter(item => item !== lineup));
  //   }
  // };

  // const handleBulkDelete = () => {
  //   const start = parseInt(startLine, 10);
  //   const end = parseInt(endLine, 10);


  //   const newLineups = props.lineups.lineups.filter((_, index) => index < start || index > end);

  //   // Instead of overwriting the whole props.lineups object, 
  //   // spread the existing properties and just modify the lineups property.
  //   const updatedLineupsObj = {
  //     ...props.lineups,
  //     lineups: newLineups
  //   };

  //   props.setLineups(updatedLineupsObj);
  // }

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
    console.log('property', property);
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
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  let sortedLineups;
  if (order === 'default') {
    sortedLineups = props.lineups.lineups;
  } else {
    sortedLineups = lodashOrderBy(props.lineups.lineups, [orderBy], [order]);
  }

  console.log('selectedTab', selectedTab)

  const exportLineupsToUpload = () => {
    // let amtOfLinesToExport = 350;
    // // let amtOfLinesToExport = amtOfLinesToExport || 350;
    // console.log('lineups', lineups.lineups);
    // const limitedLineups = lineups.lineups.slice(0, amtOfLinesToExport);

    // Here, we're creating an array for each lineup that starts with lineup.totalEverything 
    // followed by all the playerIds.
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


  console.log('props.lineups.length', props.lineups);
  return (
    <div>
      <Button
        onClick={toggleDrawer("bottom", true)}
        className="bsw-primary-btns"
        style={{ width: 165, padding: 16 }}
        variant="contained"
      >
        View lineups {props.lineups.lineups.length}
      </Button>
      <Drawer
        anchor={"bottom"}
        open={state["bottom"]}
        onClose={toggleDrawer("bottom", false)}
      >
        <div style={{ padding: "15px", height: "60vh" }}>
          <div className="lineupWrapper" style={{ marginBottom: "16px" }}>
            <h1>Optimized lineups!</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', padding: '8px' }}>

          </div>
          <CSVLink
            asyncOnClick={true}
            data={exportLineupsToUpload()}

          >
            Export lineups
          </CSVLink>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
            <Box sx={{ width: '20%%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', marginTop: '8px', flexDirection: 'row', borderBottom: '1px solid #ccc' }}>

                <p
                  style={{
                    cursor: 'pointer',
                    borderBottom: selectedTab === 0 ? '2px solid #00203d' : 'none',
                    // marginRight: 4,
                    color: selectedTab === 0 ? '#00203d' : '#888',
                    fontWeight: selectedTab === 0 ? 'bold' : 'normal'
                  }}
                  onClick={() => {
                    handleChangeTab(0)
                  }}>Top Players</p>

                <p
                  style={{
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
                  <h2 style={{ fontWeight: 'bold', marginTop: 16 }}>Top DFS Players</h2>
                  <p style={{ marginTop: 8, marginBottom: 16 }}>{props.topPlayers.length} Player(s) used</p>
                  {props.topPlayers
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
              )}

              {selectedTab === 1 && (
                <div>
                  <h2 style={{ fontWeight: 'bold', marginTop: 16 }}>Top Teams</h2>
                  <p style={{ marginTop: 8, marginBottom: 16 }}>{props.topTeams.length} Teams(s) used</p>
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
              )}
            </Box>

            <div style={{ width: '80%', overflowY: 'auto' }}>
              <input
                type="number"
                value={startLine || ""}
                onChange={e => setStartLine(e.target.value)}
                placeholder="Start Lineup"
              />
              <input
                type="number"
                value={props.lineups.lineups.length}
                maxLength={props.lineups.lineups.length}
                onChange={e => setEndLine(e.target.value)}
                placeholder="End Lineup"
              />
              <button onClick={handleBulkDelete}>Bulk Delete</button>

              <TableContainer component={Paper} style={{ width: '100%', height: '90%', overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Use</TableCell>

                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'totalfppg'}
                          direction={order}
                          onClick={() => handleSortRequest('totalfppg')}
                        >
                          Total Projected


                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'lineup_salary'}
                          direction={order}
                          onClick={() => handleSortRequest('lineup_salary')}
                        >
                          Total Salary


                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'totalTds'}
                          direction={order}
                          onClick={() => handleSortRequest('totalTds')}
                        >
                          Total Projected Touchdowns


                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'totalEverything'}
                          direction={order}
                          onClick={() => handleSortRequest('totalEverything')}
                        >
                          Total All Stats


                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'totalRecTds'}
                          direction={order}
                          onClick={() => handleSortRequest('totalRecTds')}
                        >
                          totalRecTds


                        </TableSortLabel>
                      </TableCell>
                      <TableCell>QB</TableCell>
                      <TableCell>RB</TableCell>
                      <TableCell>RB</TableCell>
                      <TableCell>WR</TableCell>
                      <TableCell>WR</TableCell>
                      <TableCell>WR</TableCell>
                      <TableCell>TE</TableCell>
                      <TableCell>Flex</TableCell>
                      <TableCell>Def</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedLineups.map((lineup, index) => {
                      // console.log('lineup', lineup)
                      return <TableRow key={index}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={savedLineups.includes(lineup)}
                            onChange={(e) => handleCheckboxChange(lineup, e.target.checked)}
                          />
                        </TableCell>
                        <TableCell>{lineup.lineup_points}</TableCell>
                        <TableCell>{lineup.lineup_salary}</TableCell>
                        <TableCell>{lineup.totalTds.toFixed(2)}</TableCell>
                        <TableCell>{lineup.totalEverything.toFixed(2)}</TableCell>
                        <TableCell>{lineup.totalRecTds.toFixed(2)}</TableCell>
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
      </Drawer>
    </div>
  );
}




          //     {/* {props.lineups.lineups.map((lineup, index) => {
          //       // console.log("lineup.lineup_num", lineup);
          //       return (
          //         <div className="lineupWrapper" style={{ marginBottom: "32px" }}>
          //           <h4>Lineup #{lineup.lineup_num}</h4>
          //           <div className="totalLineupStats" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', padding: '8px' }}>
          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'lineup_salary')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total salary: {lineup.lineup_salary}
          //             </p>
          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'lineup_points')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total projected: {lineup.lineup_points}
          //             </p>

          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'totalTds')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total Tds: {
          //                 lineup.totalTds.toFixed(2)}
          //             </p>

          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'totalEverything')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total Everything: {
          //                 lineup.totalEverything.toFixed(2)}
          //             </p>

          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'totalRecTds')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total RecTds: {
          //                 lineup.totalRecTds.toFixed(2)}
          //             </p>

          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'totalRecTgts')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total RecTgts: {
          //                 lineup.totalRecTgts.toFixed(2)}
          //             </p>

          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'totalRecYds')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total RecYds: {
          //                 lineup.totalRecYds.toFixed(2)}
          //             </p>

          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'totalReceptions')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total Receptions: {
          //                 lineup.totalReceptions.toFixed(2)}
          //             </p>

          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'totalRushAtt')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total RushAtt: {
          //                 lineup.totalRushAtt.toFixed(2)}
          //             </p>

          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'totalRushTds')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total RushTds: {
          //                 lineup.totalRushTds.toFixed(2)}
          //             </p>

          //             <p
          //               onClick={() => props.toggleAndSortData(props.lineups, 'totalRushYds')}
          //               style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
          //               Total RushYds: {
          //                 lineup.totalRushYds.toFixed(2)}
          //             </p>
          //           </div>
          //           <div>
          //             <p>Players:</p>
          //             <div
          //               style={{
          //                 display: "flex",
          //                 flexDirection: "row",
          //                 justifyContent: "flex-start",
          //               }}
          //               className="playerWrapper"
          //             >
          //               {lineup.players.map((player, index) => {
          //                 return (
          //                   <div
          //                     className="playerRow"
          //                     style={{ marginRight: "16px" }}
          //                   >
          //                     <p>{player.playerPos}</p>
          //                     <p>{player.playerName}</p>
          //                     <p>Projected: {player.playerProjected}</p>
          //                     <p>totalTds: {player.playerStats.rec_tds + player.playerStats.rush_tds}</p>
          //                     <p>player Id: <strong>{player.playerId}</strong></p>
          //                     <p>player Team: <strong>{player.playerTeam} vs {player.playerOpp}</strong></p>
          //                   </div>
          //                 );
          //               })}
          //             </div>
          //           </div>
          //         </div>
          //       );
          //     })} */}
          // {/* <p>{props.lineups.lineup_num}</p> */}
