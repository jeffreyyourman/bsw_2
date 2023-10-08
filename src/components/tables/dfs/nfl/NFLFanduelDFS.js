

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
import NFLUploadOwnProjections from './NFLUploadOwnProjections.js';
import TableComponent from './TableComponent.js';
import NflFdDfsOptimizerSettings from './NflFdDfsOptimizerSettings.js';
import LeftSideDrawer from "../../../drawers/LeftSideDrawer";

import BottomDrawer from "../../../drawers/BottomDrawer";

import GameMatchupsCarousel from '../../../carousels/GameMatchupCarousel'
import NflPlayerPosFilter from "./NflPlayerPosFilters";
import NFLPlayerSearch from "./NflPlayerSearch";
import { createTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../../../../context/AuthContext';
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
  const [teamGameGroups, setTeamGameGroups] = useState([]);
  const [teamGroups, setTeamGroups] = useState([]);

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
  const [gameMatchups, setGameMatchups] = useState([]);
  const [gameMatchupsJson, setGameMatchupsJson] = useState([]);
  const [fdSlates, setFdSlates] = useState([]);
  const [espnScoreboard, setEspnScoreboard] = useState([]);
  const [espnStandings, setEspnStandings] = useState([]);
  const getFdSlates = (abbr) => `/mockJson/nfl/slates/fd_slates.json`;
  const getGameMatchups = (abbr) => `/mockJson/nfl/nfl-current-games-nextgenstats.json`;
  const getEspnScoreboard = (abbr) => `/mockJson/nfl/2023-espn-scoreboard.json`;
  const getEspnStandings = (abbr) => `/mockJson/nfl/2023-espn-standings.json`;



  // const [slates, setSlates] = useState([]);

  const fetchFdSlates = async () => {
    const fdSlateList = getFdSlates()
    // console.log('fdSlateList', fdSlateList);
    try {
      const response = await axios.get(fdSlateList); // Note: You don't need to specify the "public" directory; just use the root path.

      // console.log('fetchfanduel slate lists - response - ', response.data);
      if (Object.keys(response.data).length === 0) {
        // fetchPlayerSlateDataSet('Main')
        setFdSlates([]);
      } else {
        setFdSlates(response.data);
      }
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };
  const fetchGameMatchups = async () => {
    try {
      const response = await axios.get('http://localhost:3000/dfs-projections/nfl/espn-scoreboard'); 
      // const response = await axios.get('https://bsw-be-api.onrender.com/dfs-projections/nba/espn-scoreboard'); 

      console.log('get game matchups slate lists - response - ', response.data.data.sports[0].leagues[0].events);
      if (Object.keys(response.data).length === 0) {
        // fetchPlayerSlateDataSet('Main')
        setGameMatchups([]);
      } else {
        setGameMatchups(response.data);
      }
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };
  // const fetchGameMatchups = async () => {
  //   const getGameMatchupsResponse = getGameMatchups()
  //   // console.log('getGameMatchupsResponse', getGameMatchupsResponse);
  //   try {
  //     const response = await axios.get(getGameMatchupsResponse); 

  //     // console.log('get game matchups slate lists - response - ', response.data);
  //     if (Object.keys(response.data).length === 0) {
  //       // fetchPlayerSlateDataSet('Main')
  //       setGameMatchupsJson([]);
  //     } else {
  //       setGameMatchupsJson(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching the JSON data:", error);
  //   }
  // };
  const fetchEspnScoreboard = async () => {
    const getEspnScoreboardRes = getEspnScoreboard()
    console.log('getEspnScoreboardRes', getEspnScoreboardRes);
    try {
      const response = await axios.get(getEspnScoreboardRes); // Note: You don't need to specify the "public" directory; just use the root path.

      console.log('getEspnScoreboardRes ', response.data);
      if (Object.keys(response.data).length === 0) {
        // fetchPlayerSlateDataSet('Main')
        setEspnScoreboard([]);
      } else {
        setEspnScoreboard(response.data);
      }
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };
  const fetchEspnStandings = async () => {
    const getEspnStandingsRes = getEspnStandings()
    console.log('getEspnStandingsRes', getEspnStandingsRes);
    try {
      const response = await axios.get(getEspnStandingsRes); // Note: You don't need to specify the "public" directory; just use the root path.

      console.log('getEspnStandingsRes ', response.data);
      if (Object.keys(response.data).length === 0) {
        // fetchPlayerSlateDataSet('Main')
        setEspnStandings([]);
      } else {
        setEspnStandings(response.data);
      }
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };




  useEffect(() => {
    // fetchPlayerDataSet(nflPlayerList)
    fetchGameMatchups()
    fetchPlayerSlateDataSet(selectedSlate)
    fetchFdSlates()
    fetchEspnScoreboard();
    fetchEspnStandings();
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

      const games = {};

      enhancedDataSet.forEach(player => {
        const [away, home] = player.Game.split('@');

        // Initialize game if not already present
        if (!games[player.Game]) {
          games[player.Game] = {
            homeTeam: {
              teamAbb: home,
              players: []
            },
            awayTeam: {
              teamAbb: away,
              players: []
            },
            gameMatchup: player.Game,
          };
        }

        // Construct the player detail object
        const playerDetail = {
          playerName: `${player.First_Name} ${player.Last_Name}`,
          position: player.Position,
          FPPG: player.FPPG,
          Team: player.Team
        };

        // Add player to the appropriate team
        if (player.Team === home) {
          games[player.Game].homeTeam.players.push(playerDetail);
        } else {
          games[player.Game].awayTeam.players.push(playerDetail);
        }
      });

      const updateGameMatchups = Object.values(games);

      setGameMatchups(updateGameMatchups)
      // console.log('updateGameMatchups', updateGameMatchups);


      const excludedPlayers = enhancedDataSet.filter(player => Number(player.FPPG) <= 2);
      // console.log('excludedPlayers', excludedPlayers);

      // Players with FPPG not equal to 0
      const remainingPlayers = enhancedDataSet.filter(player => Number(player.FPPG) > 2);


      const objectHeaderKeys = Object.keys(enhancedDataSet[0]);

      const defaultHeadersConfig = objectHeaderKeys.map((header, index) => ({
        key: header,
        label: header.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "), // This transforms 'First_Name' to 'First Name'
        order: index + 1  // This uses the index as the default order
      }));

      // Set the default headers to state directly without any overriding logic.
      setHeaders(defaultHeadersConfig);

      setData(enhancedDataSet)

      setExcludePlayerLines(excludedPlayers);
      setOgExcludePlayerLines(excludedPlayers);

      setFilteredPlayers(remainingPlayers);
      setOgFilteredPlayers(remainingPlayers);
    }
  }


  const handleCheckboxChange = (setter) => (event) => {
    setter(event.target.checked);
  };





  const handleGameSlateChange = (slateType) => {

    setSelectedSlate(slateType)
  };

  const slateTypeToDirectory = (slateType) => {
    return slateType.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };


  const getSlateFullDirectory = (abbr) => `/mockJson/nfl/slates/${abbr}-slate/nflPlayerList.json`;

  const fetchPlayerSlateDataSet = async (slateType) => {
    const directoryName = slateTypeToDirectory(slateType);
    const slateData1 = getSlateFullDirectory(directoryName)
    // console.log('slateData1', slateData1);
    try {
      const response = await axios.get(slateData1); // Note: You don't need to specify the "public" directory; just use the root path.

      // console.log('fetchPlayerSlateDataSet - response - ', response.data);
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
    // console.log('filtername;, fil', filterName)
    if (filterName.length !== 0) {
      setExcludePlayerLines(filterName);
    } else {
      setExcludePlayerLines(ogExcludePlayerLines);
    }
  };

  const filterPlayersByPosition = (position) => {
    // console.log('position', position);
    if (position === "All") {
      // console.log('all mfer', data)
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
          stackType: 'game',
          numPlayers: globalNumPlayers,
          minFromTeam: globalMinFromTeam,
          maxExposure: globalMaxExposure,
        },
        ...playerGroupRules,
        ...teamGroups,
        ...teamGameGroups,
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
              positions={['QB', 'RB', 'WR', 'TE', 'D']}
              groups={teamGroups}
              gameMatchups={gameMatchups}
              setGroups={setTeamGroups}
              filteredPlayers={filteredPlayers}
              playerGroups={playerGroups}
              setPlayerGroups={setPlayerGroups}
            />
          }
          {tabValue === 2 && <NFLTeamGameStacks
            positions={['QB', 'RB', 'WR', 'TE', 'D']}
            groups={teamGameGroups}
            gameMatchups={gameMatchups}
            setGroups={setTeamGameGroups}
            filteredPlayers={filteredPlayers}
            playerGroups={playerGroups}
            setPlayerGroups={setPlayerGroups}
          />}
          {tabValue === 3 && <NFLUploadOwnProjections
            positions={['QB', 'RB', 'WR', 'TE', 'D']}
            groups={teamGameGroups}
            gameMatchups={gameMatchups}
            setGroups={setTeamGameGroups}
            filteredPlayers={filteredPlayers}
            playerGroups={playerGroups}
            setPlayerGroups={setPlayerGroups}
          />}
        </DialogContent>
      </Dialog>
      <NflFdDfsOptimizerSettings
        open={open}
        anchor={'right'}
        handleDrawerOpen={handleDrawerOpen}
        // style={{ backgroundColor: '#fdfdfd' }}
        handleDrawerClose={handleDrawerClose}
        handleFileUpload={handleFileUpload}
        totalMaxExp={totalMaxExp}
        setTotalMaxExp={setTotalMaxExp}
        maxFromSameTeam={maxFromSameTeam}
        setMaxFromSameTeam={setMaxFromSameTeam}
        randomStd={randomStd}
        setrandomStd={setrandomStd}
        numLineups={numLineups}
        setNumLineups={setNumLineups}
        classes={classes}
        selectedSlate={selectedSlate}
        handleGameSlateChange={handleGameSlateChange}
        fdSlates={fdSlates}
        excludeOpposingDefense={excludeOpposingDefense}
        handleCheckboxChange={handleCheckboxChange}
        setExcludeOpposingDefense={setExcludeOpposingDefense}
        pairQbWithWrOrTe={pairQbWithWrOrTe}
        setPairQbWithWrOrTe={setPairQbWithWrOrTe}
        excludeQbANdRb={excludeQbANdRb}
        setExcludeQbANdRb={setExcludeQbANdRb}
        restrict2TEsSameTeam={restrict2TEsSameTeam}
        setRestrict2TEsSameTeam={setRestrict2TEsSameTeam}
        includeGlobalGameStack={includeGlobalGameStack}
        setIncludeGlobalGameStack={setIncludeGlobalGameStack}
        globalNumPlayers={globalNumPlayers}
        setGlobalNumPlayers={setGlobalNumPlayers}
        globalMinFromTeam={globalMinFromTeam}
        setGlobalMinFromTeam={setGlobalMinFromTeam}
        globalMaxExposure={globalMaxExposure}
        setGlobalMaxExposure={setGlobalMaxExposure}


      />


      {filteredPlayers.length > 0 ? (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <GameMatchupsCarousel
              games={gameMatchupsJson}
              // games={GameMatchups}
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

              overrides={[
                { key: 'include', order: 1 },
                { key: 'FPPG', order: 9 },

              ]}
              columns={excludeColumns}
              headers={headers}
              excludedKeys={['OG_FPPG', 'Nickname', 'isLocked']}
              data={excludePlayerLines.length !== 0 ? excludePlayerLines : []}
              setData={setData}
              usingExcludePlayers={true}
              setFilteredPlayers={setFilteredPlayers}
              filteredPlayers={filteredPlayers}
              excludePlayerLines={excludePlayerLines}


              setOgFilteredPlayers={setOgExcludePlayerLines}
              ogFilteredPlayers={ogExcludePlayerLines}
              setExcludePlayerLines={setExcludePlayerLines} />
              :

              <TableComponent
                overrides={[
                  { key: 'maxExposure', order: 1 },
                  { key: 'minExposure', order: 2 },
                  { key: 'exclude', order: 3 },
                  { key: 'FPPG', order: 10 },

                ]}
                columns={columns}
                usingExcludePlayers={false}
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
