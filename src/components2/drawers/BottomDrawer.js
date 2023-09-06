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
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';

export default function TemporaryDrawer(props) {
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

          <div style={{ height: "90%", overflowY: 'auto' }}>
            {props.lineups.map((lineup, index) => {
              console.log("lineup.lineup_num", lineup);
              return (
                <div className="lineupWrapper" style={{ marginBottom: "32px" }}>
                  <div className="totalLineupStats">
                    <h4>Lineup #{lineup.lineup_num}</h4>
                    <p>Total salary: {lineup.lineup_salary}</p>
                    <p>Total projected: {lineup.lineup_points}</p>
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
                            <p>Salary: {player.playerSalary}</p>
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
