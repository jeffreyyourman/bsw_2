

import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { CSVLink } from "react-csv";
import { useColumns, useExcludeColumns } from "./NflDfsTableColumns";
// import { NflPlayerList } from '../../../../mockJson/nfl/nflPlayerList'
import axios from "axios";
import { FiUnlock, FiLock } from "react-icons/fi";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import { TextField, FormHelperText, Card, FormControlLabel, Checkbox, Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PlayerGroups from './NFLPlayerGroups.js';
import NFLTeamStacks from './NFLTeamStacks.js';
import NFLTeamGameStacks from './NFLTeamGameStacks.js';
import TableComponent from './TableComponent.js';
import LeftSideDrawer from "../../../drawers/LeftSideDrawer";
// import RightSideDrawer from "../../../drawers/RightSideDrawer";
import BottomDrawer from "../../../drawers/BottomDrawer";
import GameMatchups from '../../../../mockJson/nfl/nfl-current-games-nextgenstats.json'
// import fdSlates from '../../../../mockJson/nfl/'
import fdSlates from '../../../../mockJson/nfl/slates/fd_slates.json'
// import fdSlates from '/mockJson/nfl/slates/fd_slates.json'
// const getSlateFullDirectory = (abbr) => `/mockJson/nfl/slates/${abbr}-slate/nflPlayerList.json`;
// import nflPlayerListTest from '../../../../mockJson/nfl/slates/testSlate/nflPlayerListTest.json'
import GameMatchupsCarousel from '../../../carousels/GameMatchupCarousel'
import NflPlayerPosFilter from "./NflPlayerPosFilters";
import NFLPlayerSearch from "./NflPlayerSearch";
import { createTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../../../../context/AuthContext';
import { NflOptimizedLineups } from '../../../../mockJson/nfl/lineups'
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/clerk-react";
import useMediaQuery from '@mui/material/useMediaQuery';
export default function NflFdDfsOptimizerSettings(props) {

  return (
    <LeftSideDrawer
      open={props.open}
      anchor={props.anchor}
      handleDrawerOpen={props.handleDrawerOpen}
      style={{ backgroundColor: '#fdfdfd' }}
      handleDrawerClose={props.handleDrawerClose}
    >
      <Box p={3} display="flex" flexDirection="column" alignItems="stretch">
        <Typography variant="h4" gutterBottom>Optimizer Settings</Typography>

        <input type="file" onChange={props.handleFileUpload} />


        <FormControl margin="normal" fullWidth>
          <TextField
            label="Total Player Maximum Exposure"
            type="number"
            defaultValue={props.totalMaxExp}
            InputProps={{
              inputProps: {
                min: 0,
                max: 100
              }
            }}
            onChange={(e) => {
              props.setTotalMaxExp(Number(e.target.value));
            }}
            fullWidth
            helperText="Values are from 0 to 100"
          />
        </FormControl>
        {process.env.NODE_ENV !== 'development' &&
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Max Players From Same team"
              type="number"
              defaultValue={props.maxFromSameTeam}
              InputProps={{
                inputProps: {
                  min: 1,
                  max: 4
                }
              }}
              onChange={(e) => {
                props.setMaxFromSameTeam(Number(e.target.value));
              }}
              fullWidth
              helperText="Values are from 0 to 100"
            />
          </FormControl>
        }
        <FormControl margin="normal" fullWidth>
          <TextField
            label="Random Standard Deviation"
            type="number"
            defaultValue={props.randomStd}
            onChange={(e) => {
              props.setrandomStd(Number(e.target.value));
            }}
            fullWidth
            helperText="Values are from 0 to 100"
          />
        </FormControl>

        <FormControl margin="normal" fullWidth variant="outlined">
          <InputLabel id="numLineups-label">Optimize Lineups</InputLabel>
          <Select
            labelId="numLineups-label"
            value={props.numLineups}
            onChange={(e) => props.setNumLineups(e.target.value)}
            label="Optimize Lineups"
            fullWidth
          // helperText={Variable && `Values are from 0 to 100`}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={150}>150</MenuItem>
            {/* <MenuItem value={300}>300</MenuItem> */}
            {/* <MenuItem value={500}>500</MenuItem> */}
            <MenuItem disabled={process.env.NODE_ENV !== 'development'} value={300}>300 - Upgrade to use</MenuItem>
            <MenuItem disabled={process.env.NODE_ENV !== 'development'} value={303}>303 - Upgrade to use</MenuItem>
            <MenuItem disabled={process.env.NODE_ENV !== 'development'} value={500}>500 - Upgrade to use</MenuItem>
            <MenuItem disabled={process.env.NODE_ENV !== 'development'} value={1000}>1000 - Upgrade to use</MenuItem>
          </Select>
          <FormHelperText className={props.classes.helperText}>
            {!false && `Not Paid account - sign up for the ability to optimize more lines like a shark`}
          </FormHelperText>
        </FormControl>

        <FormControl margin="normal" fullWidth variant="outlined">
          <InputLabel id="gameSelector-label">Select Game Slate</InputLabel>
          <Select
            labelId="gameSelector-label"
            value={props.selectedSlate}
            defaultValue={props.selectedSlate}
            onChange={(e) => props.handleGameSlateChange(e.target.value)}
            label="Select Game Slate"
            fullWidth
          >
            {props.fdSlates
              .filter(game => game.showdown_flag === 0)
              .map((game, index) => (
                <MenuItem key={index} value={game.slate_type}>
                  {game.slate_type} - {game.start_string}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="helperText">
            Some helper text or instructions for the user.
          </FormHelperText>
        </FormControl>


        <Card style={{ backgroundColor: 'white', padding: '16px', marginBottom: '16px' }}>
          <FormControlLabel
            style={{ whiteSpace: 'break-spaces' }}
            control={
              <Checkbox
                checked={props.excludeOpposingDefense}
                onChange={props.handleCheckboxChange(props.setExcludeOpposingDefense)}
                color="primary"
              />
            }
            label="Exclude Opposing Defense"
          />
          {props.excludeOpposingDefense &&
            <>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                style={{
                  marginLeft: "8px",
                  whiteSpace: 'break-spaces'
                }}>
                After excluding the opposing defense, you can further choose which positions to exclude.
                If no positions are chosen, it will only pair QB against the defense.
              </Typography>

              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="start"
                alignItems="center"
                marginLeft="8px"
              >
                <FormControlLabel
                  control={<Checkbox name="QB" onChange={props.handleCheckChange} />}
                  label="QB"
                />
                <FormControlLabel
                  control={<Checkbox name="WR" onChange={props.handleCheckChange} />}
                  label="WR"
                />
                <FormControlLabel
                  control={<Checkbox name="RB" onChange={props.handleCheckChange} />}
                  label="RB"
                />
                <FormControlLabel
                  control={<Checkbox name="TE" onChange={props.handleCheckChange} />}
                  label="TE"
                />
              </Box>
            </>
          }

        </Card>

        <Card style={{ backgroundColor: 'white', padding: '16px', marginBottom: '16px' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.pairQbWithWrOrTe}
                onChange={props.handleCheckboxChange(props.setPairQbWithWrOrTe)}
                color="primary"

              />
            }
            label="pair QB with WR and/or a TE "
          />
        </Card>
        <Card style={{ backgroundColor: 'white', padding: '16px', marginBottom: '16px' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.excludeQbANdRb}
                onChange={props.handleCheckboxChange(props.setExcludeQbANdRb)}
                color="primary"
              />
            }
            label="Exclude QB and RBs"
          />
        </Card>
        <Card style={{ backgroundColor: 'white', padding: '16px', marginBottom: '16px' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.restrict2TEsSameTeam}
                onChange={props.handleCheckboxChange(props.setRestrict2TEsSameTeam)}
                color="primary"
              />
            }
            label="Restrict 2 TEs from same team"
          />
        </Card>



        <Card style={{ backgroundColor: 'white', padding: '16px', marginBottom: '16px' }}>
          <FormControlLabel
            style={{ whiteSpace: 'break-spaces' }}
            control={
              <Checkbox
                checked={props.includeGlobalGameStack}
                onChange={props.handleCheckboxChange(props.setIncludeGlobalGameStack)}
                color="primary"
              />
            }
            label="Include Global Game Stack"
          />
          {props.includeGlobalGameStack &&
            <>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                style={{
                  marginLeft: "8px",
                  whiteSpace: 'break-spaces'
                }}>
                Input your preferred configurations below.
              </Typography>

              <Box
                display="flex"
                flexDirection="column"
                flexWrap="wrap"
                justifyContent="start"
                alignItems="start"
                marginLeft="8px"
                spacing={2}
              >
                <TextField
                  style={{ marginBottom: 24, marginTop: 16 }}
                  label="Number of Players"
                  type="number"
                  value={props.globalNumPlayers}
                  onChange={(e) => props.setGlobalNumPlayers(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  style={{ marginBottom: 24 }}
                  label="Min From Team"
                  type="number"
                  value={props.globalMinFromTeam}
                  onChange={(e) => props.setGlobalMinFromTeam(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  style={{ marginBottom: 24 }}
                  label="Max Exposure"
                  type="number"
                  value={props.globalMaxExposure}
                  onChange={(e) => props.setGlobalMaxExposure(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </>
          }

        </Card>


      </Box>
    </LeftSideDrawer>

  )
};
