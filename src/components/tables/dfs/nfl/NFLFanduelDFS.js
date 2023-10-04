

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
// import TableComponent from "./TableComponent.js";
const useStyles = makeStyles((theme) => ({
  helperText: {
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
  dialogContent: {
    height: '80vh',
  },
  dialogPaper: {
    height: '90vh',
    width: '90vw',
  }

}));


const theme = createTheme({
  palette: {
    primary: {
      main: '#0a3d62',
    },
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        colorPrimary: {
          '&.Mui-checked': {
            color: '#0a3d62',
          },
        },
      },
    },
  },
});


export default function NFLFanduelDFS(props) {
  const classes = useStyles();
  const columns = useColumns();
  const clerk = useClerk();
  const [openModal, setOpenModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [playerGroups, setPlayerGroups] = useState([]);

  // console.log('NflOptimizedLineups',NflOptimizedLineups());
  const handleClose = () => {
    setOpenModal(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  const { isAuthenticated, setIsAuthenticated } = useAuth();
  // console.log('isAuthenticated', isAuthenticated);
  const excludeColumns = useExcludeColumns();
  // const nflPlayerList = NflPlayerList();
  const [lineups, setLineups] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [excludedLineups, setExcludedLineups] = useState([]);
  const [isDescendingOrder, setIsDescendingOrder] = useState(true);
  const [data, setData] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [ogfilteredPlayers, setOgFilteredPlayers] = useState([]);
  const [exportPlayerLines, setExportPlayerLines] = useState([]);
  const [excludePlayerLines, setExcludePlayerLines] = useState([]);
  const [excludedTeams, setExcludedTeams] = useState([]);
  const [ogExcludePlayerLines, setOgExcludePlayerLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = useState([]);

  const [isShowingExcludePlayers, setIsShowingExcludePlayers] = useState(false);
  const [numLineups, setNumLineups] = useState(10);
  const [totalMaxExp, setTotalMaxExp] = useState(40);
  const [randomStd, setrandomStd] = useState(20);
  const [position, setPosition] = useState('All');
  // const [searchFilter, setSearchFilter] = useState('');
  const [excludeOpposingDefense, setExcludeOpposingDefense] = useState(false);
  const [pairQbWithWrOrTe, setPairQbWithWrOrTe] = useState(false);
  const [excludeQbANdRb, setExcludeQbANdRb] = useState(false);
  const [restrict2TEsSameTeam, setRestrict2TEsSameTeam] = useState(false);
  const [maxFromSameTeam, setMaxFromSameTeam] = useState(3);
  const [skillPlayersAgainstDef, setSkillPlayersAgainstDef] = useState([]);
  const [selectedSlate, setSelectedSlate] = useState('Main');

  const [includeGlobalGameStack, setIncludeGlobalGameStack] = useState(false);
  const [globalNumPlayers, setGlobalNumPlayers] = useState(4);
  const [globalMinFromTeam, setGlobalMinFromTeam] = useState(1);
  const [globalMaxExposure, setGlobalMaxExposure] = useState(50);

  const [headers, setHeaders] = useState([]);

  // const [slates, setSlates] = useState([]);


  useEffect(() => {
    // fetchPlayerDataSet(nflPlayerList)
    fetchPlayerSlateDataSet(selectedSlate)
    // fetchSlates()
    // https://www.dailyfantasyfuel.com/data/slates/next/nfl/fd?x=1
    // https://www.dailyfantasyfuel.com/data/playerdetails/nfl/fd/17042?x=1
    // https://www.dailyfantasyfuel.com/data/slates/recent/NFL/fanduel?date=2023-10-01&url=17042
    // https://www.dailyfantasyfuel.com/data/slates/next/nfl/dk?x=1

    // setLineups(NflOptimizedLineups());
  }, [selectedSlate]);

  // https://www.dailyfantasyfuel.com/data/slates/next/nfl/fd
  //   const fetchSlates = async () => {
  //     try {
  //         const fdSlateResponse = await axios.get('');
  //         console.log('fdSlateResponse.data',fdSlateResponse.data);
  //         setSlates(fdSlateResponse.data); 
  //     } catch (error) {
  //         console.error("Error fetching slates:", error);
  //     }
  // };


  const fetchPlayerDataSet = (dataSet) => {
    console.log('dataSet', dataSet);
    const headers = Object.keys(dataSet[0]);
    if (dataSet[0] === undefined) {
      setHeaders([]);
      setData([]);
      setExcludePlayerLines([]);
      setOgExcludePlayerLines([]);
      setFilteredPlayers([]);
      setOgFilteredPlayers([]);
    } else {


      const enhancedDataSet = dataSet.map(player => ({
        ...player,
        // minExposure: player.minExposure || '', // if it already exists, keep it, otherwise initialize it to an empty string
        // maxExposure: player.maxExposure || ''  // same as above
      }));



      // Players with FPPG equal to 0
      // const excludedPlayers = enhancedDataSet.filter(player => Number(player.FPPG) <= 4);
      // const excludedPlayers = enhancedDataSet.filter(player => Number(player.FPPG) <= 4);
      // console.log('excludedPlayers', excludedPlayers);

      console.log('enhancedDataSet', enhancedDataSet);
      // Players with FPPG not equal to 0
      // const remainingPlayers = enhancedDataSet.filter(player => Number(player.FPPG) > 4);
      console.log(' setHeaders(Object.keys(enhancedDataSet[0]))', Object.keys(enhancedDataSet[0]));
      // console.log('remainingPlayers', remainingPlayers);
      setHeaders(Object.keys(enhancedDataSet[0]));
      setData(enhancedDataSet)
      setExcludePlayerLines(enhancedDataSet);
      setOgExcludePlayerLines(enhancedDataSet);
      setFilteredPlayers(enhancedDataSet);
      setOgFilteredPlayers(enhancedDataSet);
    }
  }


  const handleCheckboxChange = (setter) => (event) => {
    setter(event.target.checked);
  };

  // Asynchronous function to fetch slates




  const handleGameSlateChange = (slateType) => {
    console.log('slate', slateType)
    console.log('slateType.split()[0]', slateType.split('-')[0])
    console.log('.toLowerCase()', slateType.split('-')[0].toLowerCase())

    setSelectedSlate(slateType)
    // return slateType.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };

  const slateTypeToDirectory = (slateType) => {
    return slateType.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };


  const getSlateFullDirectory = (abbr) => `/mockJson/nfl/slates/${abbr}-slate/nflPlayerList.json`;



  const fetchPlayerSlateDataSet = async (slateType) => {
    const directoryName = slateTypeToDirectory(slateType);
    const slateData1 = getSlateFullDirectory(directoryName)
    console.log('slateData1', slateData1);
    try {
      const response = await axios.get(slateData1); // Note: You don't need to specify the "public" directory; just use the root path.

      console.log('fetchPlayerSlateDataSet - response - ', response.data);
      if (Object.keys(response.data).length === 0) {
        fetchPlayerSlateDataSet('Main')
      } else {

        fetchPlayerDataSet(response.data);
      }
      // setData(response.data);
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };



  const handleCheckChange = (event) => {
    const { name, checked } = event.target;

    setSkillPlayersAgainstDef((prevState) => {
      if (checked && !prevState.includes(name)) {
        return [...prevState, name];
      } else {
        return prevState.filter((item) => item !== name);
      }
    });
  };

  const handleSearchOnChange = (text) => {
    if (position !== 'All') setPosition('All')
    if (excludedTeams.length !== 0) setExcludedTeams([])

    let searchTextLowerCase = text.toLowerCase();
    const filterName = ogfilteredPlayers.filter((player) => {
      let newPlayerName = player.Nickname.toLowerCase();
      if (newPlayerName.includes(searchTextLowerCase)) {
        return player;
      }
    });
    // console.log('filtername;, fil', filterName)
    if (filterName.length !== 0) {
      setFilteredPlayers(filterName);
    } else {
      setFilteredPlayers(ogfilteredPlayers);
    }
  };
  const handleSearchExcludedPlayersOnChange = (text) => {
    if (position !== 'All') setPosition('All')
    if (excludedTeams.length !== 0) setExcludedTeams([])

    let searchTextLowerCase = text.toLowerCase();
    const filterName = ogExcludePlayerLines.filter((player) => {
      let newPlayerName = player.Nickname.toLowerCase();
      if (newPlayerName.includes(searchTextLowerCase)) {
        return player;
      }
    });
    console.log('filtername;, fil', filterName)
    if (filterName.length !== 0) {
      setExcludePlayerLines(filterName);
    } else {
      setExcludePlayerLines(ogExcludePlayerLines);
    }
  };

  const filterPlayersByPosition = (position) => {
    console.log('position', position);
    if (position === "All") {
      console.log('all mfer', data)
      setFilteredPlayers(ogfilteredPlayers);
    } else {

      setFilteredPlayers(ogfilteredPlayers.filter(player => player.Position === position));
    }
  };

  const handleExcludeTeams = (teamAbbr) => {
    if (excludedTeams.includes(teamAbbr)) {
      // If the team is already excluded, remove it from the exclusion list
      setExcludedTeams(prevTeams => prevTeams.filter(abbr => abbr !== teamAbbr));

      // Include players from this team back into the filtered list
      setFilteredPlayers(ogfilteredPlayers);

    } else {
      // If the team isn't excluded yet, add it to the exclusion list
      setExcludedTeams(prevTeams => [...prevTeams, teamAbbr]);

      // Exclude players from this team
      setFilteredPlayers(prevPlayers => prevPlayers.filter(player => player.Team !== teamAbbr));
    }
  };


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      const parsedData = csvData.split("\n").map((row) => {
        // Trim each cell to remove spaces and control characters
        return row.split(",").map(cell => cell.trim());
      });
      // Clean up headers (keys for your objects)
      const headers = parsedData[0].map(header => header.trim().replace(/\r$/, ''));

      const rows = parsedData.slice(1);
      // console.log('rows', rows);
      const formattedData = rows.map((row) => {
        // Convert fantasy points per game to numbers
        // console.log('row[5]', row[5])
        row[5] = parseFloat(parseFloat(row[5]).toFixed(2));
        row[5] = isNaN(row[5]) ? 0 : row[5];


        const formattedRow = headers.reduce((acc, header, index) => {
          if (header === "Roster Position" && row[index] === "DEF") {
            acc[header] = "D";
          } else {
            acc[header] = row[index];
          }
          return acc;
        }, {});

        // Delete property with empty string key
        if (formattedRow[""] !== undefined) {
          delete formattedRow[""];
        }

        return formattedRow;
      }).filter(obj => obj.Id !== '');  // This line filters out objects with an empty Id


      fetchPlayerDataSet(formattedData)
      setOpen(false);

    }
    reader.readAsText(file);
  };

  let handleSubmitPlayers = () => {
    setLoading(true)


    console.log('player', filteredPlayers[0]);
    const transformedPlayers = filteredPlayers.map(player => {
      return {
        FPPG: player.FPPG,
        First_Name: player.First_Name,
        Game: player.Game,
        Id: player.Id,
        Injury_Details: player.Injury_Details,
        Injury_Indicator: player.Injury_Indicator,
        isLocked: player.isLocked,
        Last_Name: player.Last_Name,
        // minExposure: player.minExposure,
        // maxExposure: player.maxExposure,
        minExposure: !player.minExposure ? 0 : Number(player.minExposure),
        maxExposure: !player.maxExposure || player.maxExposure == 0 ? totalMaxExp : Number(player.maxExposure),
        Nickname: player.Nickname,
        Opponent: player.Opponent,
        Position: player.Position,
        Roster_Position: player["Roster Position"],
        Salary: player.Salary,
        Team: player.Team,
        Tier: player.Tier,
        playerStats: {
          fppg: player.FPPG,
          fanduel_fp: player.fanduel_fp,
          fanduel_value: player.fanduel_value,
          opp_rank: player.opp_rank,
          opp_team: player.opp_team,
          ovr_rank: player.ovr_rank,
          pass_comp_att: player.pass_comp_att,
          pass_interceptions: player.pass_interceptions,
          pass_tds: player.pass_tds,
          pass_yards: player.pass_yards,
          pos_rank: player.pos_rank,
          rec_att: player.rec_att,
          rec_tds: player.rec_tds,
          rec_tgts: player.rec_tgts,
          rec_yds: player.rec_yds,
          receptions: player.receptions,
          rush_att: player.rush_att,
          rush_tds: player.rush_tds,
          rush_yds: player.rush_yds
        }
      };
    });


    const playerGroupRules = groups.map(group => ({
      stackType: 'playerGroup',
      players: group,
      minFromGroup: 1,
      maxExposure: 50
    }));


    console.log('playerGroupRules', playerGroupRules);
    let myargs = {
      numLineups: parseInt(numLineups, 10),
      site: 'FANDUEL',
      sport: 'FOOTBALL',
      totalMaxExp,
      randomStd,
      players: transformedPlayers,
      // maxFromPosition: 3,
      // maxFromPosition: {
      //   // "TE": 1, 
      //   // "WR": 2 //if i don't want wr in TE i would set it to 2 because there are 3 max per lineup and the third would be avoided which is the flex spot
      // },
      maxFromSameTeam: maxFromSameTeam > 4 || maxFromSameTeam < 1 ? 3 : maxFromSameTeam,
      // maxFromSameTeam: {
      //   "NYG": 2,
      //   "NYJ": 2,
      // },

      rules: [
        restrict2TEsSameTeam && {
          stackType: 'restrictSame',
          positions: ['TE', 'TE'],

        },
        excludeQbANdRb && {
          stackType: 'restrictSame',
          positions: ['RB', 'QB'],

        },
        pairQbWithWrOrTe && {
          stackType: 'position',
          positions: ['QB', ['WR', 'TE']],
          maxExposure: 50
        },
        excludeOpposingDefense && {
          stackType: 'restrictOpp',
          team1Pos: ['D'],
          team2Pos: skillPlayersAgainstDef.length === 0 ? ['QB'] : skillPlayersAgainstDef,
        },
        includeGlobalGameStack && {
          //           globalNumPlayers
          // globalMinFromTeam
          // globalMaxExposure

          // "stackType": "game",
          // "numPlayers": 4,
          // "minFromTeam": 1,
          // "maxExposure": 50

          stackType: 'game',
          numPlayers: globalNumPlayers,
          minFromTeam: globalMinFromTeam,
          maxExposure: globalMaxExposure,
        },
        ...playerGroupRules
      ].filter(Boolean)
    };
    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Bearer yourTokenHere",
    };

    axios
      .post(
        // "https://bsw-be-api.onrender.com/optimizer",
        "https://testingoptimizer.azurewebsites.net/api/httptrigger1",
        // "https://anxious-teal-gilet.cyclic.cloud/optimizer",
        { data: myargs },
        {
          // headers,
          // timeout: 600000  // 10 minutes in milliseconds
        }
      )
      .then((response) => {
        console.log('response.data', response.data);
        const fetchedLineups = response.data[0].lineups;
        const manipulatedLineups = fetchedLineups.map(lineup => {
          let totalfppg = 0;
          // let pass_tds = 0;
          // let pass_interceptions = 0;
          // let pass_yards = 0;

          // let totalTds = 0;
          let totalRushAtt = 0;
          let totalRushTds = 0;
          let totalRushYds = 0;
          let totalReceptions = 0;
          let totalRecYds = 0;
          let totalRecTgts = 0;
          let totalRecTds = 0;
          let totalPassTds = 0
          let totalPassInterceptions = 0
          let totalPassYards = 0

          lineup.players.forEach(player => {
            const stats = player.playerStats;
            stats.rush_att = Number(stats.rush_att);
            stats.fppg = Number(stats.fppg);
            stats.rush_tds = Number(stats.rush_tds);
            stats.rush_yds = Number(stats.rush_yds);
            stats.receptions = Number(stats.receptions);
            stats.rec_yds = Number(stats.rec_yds);
            stats.rec_tgts = Number(stats.rec_tgts);
            stats.rec_tds = Number(stats.rec_tds);
            stats.pass_tds = Number(stats.pass_tds);
            stats.pass_interceptions = Number(stats.pass_interceptions);
            stats.pass_yards = Number(stats.pass_yards);


            totalPassTds += stats.pass_tds
            totalPassInterceptions += stats.pass_interceptions
            totalPassYards += stats.pass_yards


            totalfppg += stats.fppg;
            totalRushAtt += stats.rush_att;
            totalRushTds += stats.rush_tds;
            totalRushYds += stats.rush_yds;
            totalReceptions += stats.receptions;
            totalRecYds += stats.rec_yds;
            totalRecTgts += stats.rec_tgts;
            totalRecTds += stats.rec_tds;
          });


          return {
            ...lineup,
            totalfppg,
            totalPassTds,
            totalPassInterceptions,
            totalPassYards,
            totalRushAtt,
            totalRushTds,
            totalRushYds,
            totalReceptions,
            totalRecYds,
            totalRecTgts,
            totalRecTds,
            totalTds: totalRushTds + totalRecTds + totalPassTds,
            totalEverything:
              totalfppg +
              totalPassTds -
              totalPassInterceptions +
              totalPassYards +
              totalRushAtt +
              totalRushTds +
              totalRushYds +
              totalReceptions +
              totalRecYds +
              totalRecTgts +
              totalRecTds
          };


        });
        const sortedLineupsDes = sortByMetricDescending(manipulatedLineups, 'lineup_points')
        // const sortedLineupsA = sortByMetricAscending(manipulatedLineups, 'lineup_points')
        setTopTeams(response.data[1].top_teams)
        setTopPlayers(response.data[1].top_players)
        setLineups({ lineups: sortedLineupsDes, topPlayersTeams: response.data[1] });

        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.error(error);
      });
  };

  const exportLineupsToUpload = () => {
    let amtOfLinesToExport = 350;
    // let amtOfLinesToExport = amtOfLinesToExport || 350;
    console.log('lineups', lineups.lineups);
    const limitedLineups = lineups.lineups.slice(0, amtOfLinesToExport);

    // Here, we're creating an array for each lineup that starts with lineup.totalEverything 
    // followed by all the playerIds.
    const csvData = limitedLineups.map(lineup => {
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

  const toggleAllAndExcludedPlayers = () => {
    setIsShowingExcludePlayers(!isShowingExcludePlayers);
  }

  const toggleOptimizerBuildStackPropertiesDrawer = () => {
    setOpen(!open);
  }

  const toggleAndSortData = (lineupData, metric) => {
    // Toggle the sorting direction
    setIsDescendingOrder(!isDescendingOrder);

    if (isDescendingOrder) {
      sortDataByDec(lineupData, metric);
    } else {
      sortDataByAsc(lineupData, metric);
    }
  }


  // Ascending Order = lowest to highest
  const sortByMetricAscending = (lineups, metric) => {
    return [...lineups].sort((a, b) => a[metric] - b[metric]);
  }

  // Descending Order = highest to lowest
  const sortByMetricDescending = (lineups, metric) => {
    return [...lineups].sort((a, b) => b[metric] - a[metric]);
  }
  const sortDataByAsc = (orderData, key) => {
    const sortedLineupsAsc = sortByMetricAscending(orderData, key)
    setLineups(sortedLineupsAsc);
  }
  const sortDataByDec = (orderData, key) => {
    const sortedLineupsDes = sortByMetricDescending(orderData, key)
    setLineups(sortedLineupsDes);
  }



  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  return (
    <ThemeProvider theme={theme}>
      {/* <SignIn /> */}
      {/* <button className="sign-up-btn" onClick={() => clerk.openSignUp({})}>
        Sign up
      </button> */}
      <Dialog
        fullScreen
        fullWidth
        maxWidth="xl"
        open={openModal}
        onClose={handleClose}

        PaperProps={{
          className: classes.dialogPaper
        }}
      >


        <DialogTitle

        >
          Advanced Settings
          <div
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              cursor: 'pointer',
              fontSize: '1.5rem'
            }}
          >
            X
          </div>
        </DialogTitle>
        <DialogContent
          style={{ backgroundColor: '#efefef' }}
          className={classes.dialogContent}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Player Groups" />
            <Tab label="Team Stacks" />
            <Tab label="Game Stacks" />
            <Tab label="Upload Own Projections" />
          </Tabs>

          {tabValue === 0 && (
            <PlayerGroups
              groups={groups}
              setGroups={setGroups}
              filteredPlayers={filteredPlayers}
              playerGroups={playerGroups}
              setPlayerGroups={setPlayerGroups}
            />
          )}

          {tabValue === 1 &&
            <NFLTeamStacks
              groups={groups}
              setGroups={setGroups}
              filteredPlayers={filteredPlayers}
              playerGroups={playerGroups}
              setPlayerGroups={setPlayerGroups}
            />
          }
          {tabValue === 2 && <NFLTeamGameStacks
            groups={groups}
            setGroups={setGroups}
            filteredPlayers={filteredPlayers}
            playerGroups={playerGroups}
            setPlayerGroups={setPlayerGroups}
          />}
          {tabValue === 3 && <div>Upload own Projections coming soon</div>}
        </DialogContent>
      </Dialog>

      <LeftSideDrawer
        open={open}
        anchor={'right'}
        handleDrawerOpen={handleDrawerOpen}
        style={{ backgroundColor: '#fdfdfd' }}
        handleDrawerClose={handleDrawerClose}
      >
        <Box p={3} display="flex" flexDirection="column" alignItems="stretch">
          <Typography variant="h4" gutterBottom>Optimizer Settings</Typography>

          <input type="file" onChange={handleFileUpload} />


          <FormControl margin="normal" fullWidth>
            <TextField
              label="Total Player Maximum Exposure"
              type="number"
              defaultValue={totalMaxExp}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 100
                }
              }}
              onChange={(e) => {
                setTotalMaxExp(Number(e.target.value));
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
                defaultValue={maxFromSameTeam}
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: 4
                  }
                }}
                onChange={(e) => {
                  setMaxFromSameTeam(Number(e.target.value));
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
              defaultValue={randomStd}
              onChange={(e) => {
                setrandomStd(Number(e.target.value));
              }}
              fullWidth
              helperText="Values are from 0 to 100"
            />
          </FormControl>

          <FormControl margin="normal" fullWidth variant="outlined">
            <InputLabel id="numLineups-label">Optimize Lineups</InputLabel>
            <Select
              labelId="numLineups-label"
              value={numLineups}
              onChange={(e) => setNumLineups(e.target.value)}
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
            <FormHelperText className={classes.helperText}>
              {!false && `Not Paid account - sign up for the ability to optimize more lines like a shark`}
            </FormHelperText>
          </FormControl>

          <FormControl margin="normal" fullWidth variant="outlined">
            <InputLabel id="gameSelector-label">Select Game Slate</InputLabel>
            <Select
              labelId="gameSelector-label"
              value={selectedSlate}
              defaultValue={selectedSlate}
              onChange={(e) => handleGameSlateChange(e.target.value)}
              label="Select Game Slate"
              fullWidth
            >
              {fdSlates
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
                  checked={excludeOpposingDefense}
                  onChange={handleCheckboxChange(setExcludeOpposingDefense)}
                  color="primary"
                />
              }
              label="Exclude Opposing Defense"
            />
            {excludeOpposingDefense &&
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
                    control={<Checkbox name="QB" onChange={handleCheckChange} />}
                    label="QB"
                  />
                  <FormControlLabel
                    control={<Checkbox name="WR" onChange={handleCheckChange} />}
                    label="WR"
                  />
                  <FormControlLabel
                    control={<Checkbox name="RB" onChange={handleCheckChange} />}
                    label="RB"
                  />
                  <FormControlLabel
                    control={<Checkbox name="TE" onChange={handleCheckChange} />}
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
                  checked={pairQbWithWrOrTe}
                  onChange={handleCheckboxChange(setPairQbWithWrOrTe)}
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
                  checked={excludeQbANdRb}
                  onChange={handleCheckboxChange(setExcludeQbANdRb)}
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
                  checked={restrict2TEsSameTeam}
                  onChange={handleCheckboxChange(setRestrict2TEsSameTeam)}
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
                  checked={includeGlobalGameStack}
                  onChange={handleCheckboxChange(setIncludeGlobalGameStack)}
                  color="primary"
                />
              }
              label="Include Global Game Stack"
            />
            {includeGlobalGameStack &&
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
                    value={globalNumPlayers}
                    onChange={(e) => setGlobalNumPlayers(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    style={{ marginBottom: 24 }}
                    label="Min From Team"
                    type="number"
                    value={globalMinFromTeam}
                    onChange={(e) => setGlobalMinFromTeam(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    style={{ marginBottom: 24 }}
                    label="Max Exposure"
                    type="number"
                    value={globalMaxExposure}
                    onChange={(e) => setGlobalMaxExposure(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </>
            }

          </Card>


        </Box>
      </LeftSideDrawer>


      {filteredPlayers.length > 0 ? (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <GameMatchupsCarousel
              games={GameMatchups}
              handleExcludeTeams={handleExcludeTeams}
              excludedTeams={excludedTeams}
              setExcludedTeams={setExcludedTeams}
            />

          </div>

          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
              width: '100%'  // Ensure it takes full width
            }}>
              {!isShowingExcludePlayers &&
                <div className="dfs-optimizer-filter-wrapper">
                  <NflPlayerPosFilter
                    players={data}
                    selectedPosition={position}
                    filterPlayersByPosition={filterPlayersByPosition}
                    onPositionChange={setPosition}
                  />
                </div>}
              <div className="dfs-optimizer-filter-wrapper">
                {isShowingExcludePlayers ?
                  <NFLPlayerSearch
                    data={excludePlayerLines}
                    onSearch={handleSearchExcludedPlayersOnChange}
                    isShowingExcludePlayers={isShowingExcludePlayers}
                  />
                  :
                  <NFLPlayerSearch
                    data={filteredPlayers}
                    onSearch={handleSearchOnChange}
                    isShowingExcludePlayers={isShowingExcludePlayers}
                  />

                }
              </div>
              <div className="dfs-optimizer-filter-wrapper">
                <Button
                  onClick={toggleAllAndExcludedPlayers}
                  className="bsw-primary-btns"
                  variant="contained"
                >
                  {isShowingExcludePlayers ? 'Back to all' : `View ${excludePlayerLines.length} excluded player(s)`}
                </Button>
              </div>
              {!isShowingExcludePlayers &&
                <div className="dfs-optimizer-filter-wrapper">
                  <Button
                    onClick={toggleOptimizerBuildStackPropertiesDrawer}
                    className="bsw-primary-btns"
                    variant="contained"
                  >
                    Optimizer Options
                  </Button>
                  <Button
                    onClick={() => setOpenModal(true)}
                    className="bsw-primary-btns"
                    variant="contained"
                    style={{ marginLeft: '8px' }}
                  >
                    Advanced Settings
                  </Button>


                </div>}

            </div>
          </div>

          <h2><span style={{ fontWeight: '500', fontSize: 24 }}>{selectedSlate} Slate</span></h2>
          <div style={{ overflow: "auto" }}>
            {/* <h2><span style={{ fontWeight: '500', fontSize: 24 }}>Slate:<span style={{display: 'block'}}> {selectedSlate}</span></span></h2> */}

            {isShowingExcludePlayers ? <TableComponent
              columns={excludeColumns}
              headers={headers}
              excludedKeys={['OG_FPPG']}
              data={excludePlayerLines.length !== 0 ? excludePlayerLines : []}
              setData={setData}
              setFilteredPlayers={setFilteredPlayers}
              filteredPlayers={filteredPlayers}
              excludePlayerLines={excludePlayerLines}


              setOgFilteredPlayers={setOgExcludePlayerLines}
              ogFilteredPlayers={ogExcludePlayerLines}
              setExcludePlayerLines={setExcludePlayerLines} />
              :

              <TableComponent
                columns={columns}
                excludedKeys={['OG_FPPG', 'Nickname',]}
                headers={headers}
                data={filteredPlayers}
                setData={setData}
                setFilteredPlayers={setFilteredPlayers}
                filteredPlayers={filteredPlayers}
                excludePlayerLines={excludePlayerLines}
                setOgFilteredPlayers={setOgFilteredPlayers}
                ogFilteredPlayers={ogfilteredPlayers}
                setExcludePlayerLines={setExcludePlayerLines} />

            }


          </div>

          <div style={{ width: '150px', marginTop: '8px' }}>

            <Button
              disabled={loading}
              onClick={handleSubmitPlayers}
              className="bsw-primary-btns"
              variant="contained"
              fullWidth
            >
              {loading ? "Loading..." : 'Optimize'}
            </Button>

            {lineups.length !== 0 && (
              <div style={{ marginTop: "64px" }}>
                <p>total lines: {lineups.lineups.length}</p>
                <BottomDrawer
                  exportLineupsToUpload={exportLineupsToUpload}
                  toggleAndSortData={toggleAndSortData}
                  sortDataByAsc={sortDataByAsc}
                  sortDataByDec={sortDataByDec}
                  exportPlayerLines={exportPlayerLines}
                  topPlayers={topPlayers}
                  topTeams={topTeams}
                  setLineups={setLineups}
                  lineups={lineups}


                />
              </div>
            )}
          </div>

        </div>
      ) : null}
    </ThemeProvider>
  );
}
