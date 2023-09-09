import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CSVLink } from "react-csv";

// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';

export default function TemporaryDrawer(props) {
  // console.log('props.lineups', props.lineups)
  const [state, setState] = React.useState({
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


  // totalEverything: 677.4599999999999
  // totalRecTds: 1.55
  // totalRecTgts: 31.790000000000003
  // totalRecYds: 252.53
  // totalReceptions: 20.45
  // totalRushAtt: 64
  // totalRushTds: 2.42
  // totalRushYds: 304.72


  return (
    <div>
      <Button onClick={toggleDrawer("bottom", true)}>View lineups</Button>
      <Drawer
        anchor={"bottom"}
        open={state["bottom"]}
        onClose={toggleDrawer("bottom", false)}
      >
        <div style={{ padding: "50px", height: "60vh" }}>
          <div className="lineupWrapper" style={{ marginBottom: "16px" }}>
            <h1>Optimized lineups!</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', padding: '8px' }}>

            {/* <Button onClick={() => props.sortDataByAsc(props.lineups, 'totalTds')}>Sort by Asc order</Button>
          <Button onClick={() => props.sortDataByDec(props.lineups, 'totalTds')}>Sort by Dec order</Button> */}

          </div>
          <CSVLink
            asyncOnClick={true}
            data={props.exportLineupsToUpload()}
            // onClick={(event, done) => {
            //   props.exportLineupsToUpload(done)
            //   // axios.post("/spy/user").then(() => {
            //   //   done(); // REQUIRED to invoke the logic of component
            //   // });
            // }}
          >
            Export lineups
          </CSVLink>

          <div style={{ height: "90%", overflowY: 'auto' }}>
            {props.lineups.map((lineup, index) => {
              // console.log("lineup.lineup_num", lineup);
              return (
                <div className="lineupWrapper" style={{ marginBottom: "32px" }}>
                  <h4>Lineup #{lineup.lineup_num}</h4>
                  <div className="totalLineupStats" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', padding: '8px' }}>
                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'lineup_salary')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total salary: {lineup.lineup_salary}
                    </p>
                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'lineup_points')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total projected: {lineup.lineup_points}
                    </p>

                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'totalTds')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total Tds: {
                        lineup.totalTds.toFixed(2)}
                    </p>

                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'totalEverything')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total Everything: {
                        lineup.totalEverything.toFixed(2)}
                    </p>

                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'totalRecTds')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total RecTds: {
                        lineup.totalRecTds.toFixed(2)}
                    </p>

                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'totalRecTgts')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total RecTgts: {
                        lineup.totalRecTgts.toFixed(2)}
                    </p>

                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'totalRecYds')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total RecYds: {
                        lineup.totalRecYds.toFixed(2)}
                    </p>

                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'totalReceptions')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total Receptions: {
                        lineup.totalReceptions.toFixed(2)}
                    </p>

                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'totalRushAtt')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total RushAtt: {
                        lineup.totalRushAtt.toFixed(2)}
                    </p>

                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'totalRushTds')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total RushTds: {
                        lineup.totalRushTds.toFixed(2)}
                    </p>

                    <p
                      onClick={() => props.toggleAndSortData(props.lineups, 'totalRushYds')}
                      style={{ border: '1px solid lightgrey', padding: '8px', margin: '8px' }}>
                      Total RushYds: {
                        lineup.totalRushYds.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p>Players:</p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                      className="playerWrapper"
                    >
                      {lineup.players.map((player, index) => {
                        return (
                          <div
                            className="playerRow"
                            style={{ marginRight: "16px" }}
                          >
                            <p>{player.playerPos}</p>
                            <p>{player.playerName}</p>
                            <p>Projected: {player.playerProjected}</p>
                            <p>totalTds: {player.playerStats.rec_tds + player.playerStats.rush_tds}</p>
                            {/* <p>Salary: {player.playerSalary}</p> */}
                            <p>player Id: {player.playerId}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* <p>{props.lineups.lineup_num}</p> */}
        </div>
      </Drawer>
    </div>
  );
}
