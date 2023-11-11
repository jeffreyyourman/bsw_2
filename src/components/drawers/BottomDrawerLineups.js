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

export default function BottomDrawerLineups(props) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  return (
    <div>
      <Button
        onClick={toggleDrawer("bottom", true)}
        className="bsw-primary-btns"
        style={{ width: 165 }}
        variant="contained"
      >
        View lineups
      </Button>
      <Drawer
        anchor={"bottom"}
        open={state["bottom"]}
        onClose={toggleDrawer("bottom", false)}
      >

        {props.children}

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
