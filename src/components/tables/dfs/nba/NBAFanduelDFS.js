

import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { CSVLink } from "react-csv";
import { useColumns, useExcludeColumns } from "./NbaDfsTableColumns";
// import { NflPlayerList } from '../../../../mockJson/nba/nflPlayerList'
import axios from "axios";
import { FiUnlock, FiLock } from "react-icons/fi";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import {
  TextField,
  FormHelperText,
  Card,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PlayerGroups from './NBAPlayerGroups.js';
import NBATeamStacks from './NBATeamStacks.js';
import NBATeamGameStacks from './NBATeamGameStacks.js';
import NBAUploadOwnProjections from './NBAUploadOwnProjections.js';
import TableComponent from './TableComponent.js';
import NbaFdDfsOptimizerSettings from './NbaFdDfsOptimizerSettings.js';
import GameMatchupsCarousel from '../../../carousels/GameMatchupCarousel'
import NbaPlayerPosFilter from "./NbaPlayerPosFilters";
import NBAFanduelDfsLineups from "./NBAFanduelDfsLineups";
import NbaPlayerSearch from "./NbaPlayerSearch";
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


export default function NBAFanduelDFS(props) {
  const useLocal = true
  const useOptimizerUrl = true

  let baseUrl;
  if (process.env.NODE_ENV === 'development') {
    if (useLocal) {
      baseUrl = 'http://localhost:3000'
    } else {

      baseUrl = 'https://bsw-be-api.onrender.com'
    }
  } else {
    baseUrl = 'https://bsw-be-api.onrender.com';
  }
  const classes = useStyles();
  const columns = useColumns();
  const clerk = useClerk();
  const [openModal, setOpenModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [tableTabValue, setTableTabValue] = useState(1);
  const [playerGroups, setPlayerGroups] = useState([]);

  // console.log('NflOptimizedLineups',NflOptimizedLineups());
  const handleClose = () => {
    setOpenModal(false);
  };

  const handleTabChange = (event, newValue) => {
    if (successUploadOwnProjections) {
      setSuccessUploadOwnProjections(false);
    }
    setTabValue(newValue);
  };
  const handleTableTabChange = (event, newValue) => {
    setTableTabValue(newValue);
  };


  const { isAuthenticated, setIsAuthenticated } = useAuth();
  // console.log('isAuthenticated', isAuthenticated);
  const excludeColumns = useExcludeColumns();
  // const nflPlayerList = NflPlayerList();
  const [lineups, setLineups] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [topPlayersAndTeams, SetTopPlayersAndTeams] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [excludedLineups, setExcludedLineups] = useState([]);
  const [isDescendingOrder, setIsDescendingOrder] = useState(true);
  const [data, setData] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [filteredInjuredPlayers, setFilteredInjuredPlayers] = useState([]);
  const [submittedPlayersForOptimizer, setSubmittedPlayersForOptimizer] = useState([]);
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
  const [numLineups, setNumLineups] = useState(25);
  const [totalMaxExp, setTotalMaxExp] = useState(35);
  const [randomStd, setrandomStd] = useState(25);
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
  const [gameAndPlayerMatchups, setGameAndPlayerMatchups] = useState([]);
  const [espnScoreBoardMatchups, setEspnScoreBoardMatchups] = useState([]);
  const [espnScoreBoardMatchupsLoading, setEspnScoreBoardMatchupsLoading] = useState(false);
  const [gameMatchupsJson, setGameMatchupsJson] = useState([]);
  const [fdSlates, setFdSlates] = useState([]);
  const [espnScoreboard, setEspnScoreboard] = useState([]);
  const [espnStandings, setEspnStandings] = useState([]);
  const [successUploadOwnProjections, setSuccessUploadOwnProjections] = useState(false);
  const [successUploadOwnProjectionsLoading, setSuccessUploadOwnProjectionsLoading] = useState(false);
  const [getLineupsErr, setGetLineupsErr] = useState('');
  const getFdSlates = (abbr) => `/mockJson/nba/slates/fd_slates.json`;
  // const getGameMatchups = (abbr) => `/mockJson/nba/nfl-current-games-nextgenstats.json`;
  // const getEspnScoreboard = (abbr) => `/mockJson/nba/2023-espn-scoreboard.json`;
  const getEspnStandings = (abbr) => `/mockJson/nba/2023-espn-standings.json`;



  // const [slates, setSlates] = useState([]);

  const fetchFdSlates = async () => {
    // const fdSlateList = getFdSlates()
    // console.log('fdSlateList', fdSlateList);
    try {

      const response = await axios.get(`${baseUrl}/dfs-projections/nba/fd/upcoming-slates`);
      // const response = await axios.get(fdSlateList); 

      // console.log('fetchfanduel slate lists - response - ', response.data);
      if (Object.keys(response.data).length === 0) {
        // fetchPlayerSlateDataSet('Main')
        setFdSlates([]);
      } else {
        setFdSlates(response.data.data);
        // call projections inside here and inside there align the fppg here. 
        // then make the call for here once the mapping of the projections and Ids happen
        // fetchPlayerSlateDataSet(selectedSlate)
      }
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };
  const fetchGameMatchups = async () => {
    setEspnScoreBoardMatchupsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/dfs-projections/nba/espn-scoreboard`);

      console.log('get game matchups slate lists - response - ', response.data.data.sports[0].leagues[0].events);
      if (Object.keys(response.data).length === 0) {
        // fetchPlayerSlateDataSet('Main')
        setEspnScoreBoardMatchups([]);
      } else {
        setEspnScoreBoardMatchups(response.data.data.sports[0].leagues[0].events);
      }
      setEspnScoreBoardMatchupsLoading(false)
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
      setEspnScoreBoardMatchupsLoading(false)
    }
  };

  // const fetchEspnScoreboard = async () => {
  //   const getEspnScoreboardRes = getEspnScoreboard()
  //   try {
  //     const response = await axios.get(getEspnScoreboardRes);

  //     if (Object.keys(response.data).length === 0) {
  //       setEspnScoreboard([]);
  //     } else {
  //       setEspnScoreboard(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching the JSON data:", error);
  //   }
  // };
  const fetchEspnStandings = async () => {
    const getEspnStandingsRes = getEspnStandings()

    try {
      const response = await axios.get(getEspnStandingsRes);


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
    fetchGameMatchups()
    fetchPlayerSlateDataSet(selectedSlate)
    fetchFdSlates()
    // fetchEspnScoreboard();
    fetchEspnStandings();

  }, [selectedSlate]);





  // The player upload list can include Data that we already have and in which case take the uploaded data
  // the handleFileUpload creates a new set of headers, this is where we want the two to be merged.
  // align the player.Id 's and use the required FPPG and fill in the rest that aren't already in the headers and push to end of headers. 
  // if there are any additional columns i don't already have, put those in as well.
  // if the player id that is uploaded doesn't match anything in the dataset, just return current dataset. 


  // also in the fetchPlayerDataSet function. I am going to make a call for the daily fantasy fuel projections and align teh fppg column with that to load the page. 
  // i need the headers to always be these plus whatever additional ones they have. 
  // Id	Position
  // First Name
  // Nickname
  // Last Name
  // FPPG
  // Played
  // Salary
  // Game
  // Team
  // Opponent
  // Injury Indicator
  // Injury Details
  // Tier			
  // Roster Position

  const handleFileUpload = (e) => {
    setSuccessUploadOwnProjectionsLoading(true)
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

      const mergedData = formattedData.map(uploadedPlayer => {
        const existingPlayer = data.find(player => player.Id === uploadedPlayer.Id);
        if (existingPlayer) {
          // If the uploaded player exists in the current dataset, merge them
          return { ...existingPlayer, ...uploadedPlayer };
        }
        return uploadedPlayer;
      });


      console.log('mergedData', mergedData);

      fetchPlayerDataSet(mergedData, 'upload');




      // fetchPlayerDataSet(formattedData, 'upload')
      setOpen(false);
      setSuccessUploadOwnProjections(true)
      setSuccessUploadOwnProjectionsLoading(false)

    }
    reader.readAsText(file);
  };




  const fetchPlayerDataSet = (dataSet, key) => {
    console.log(`${key} - dataSet`, dataSet);
    if (dataSet[0] === undefined) {
      setHeaders([]);
      setData([]);
      setExcludePlayerLines([]);
      setOgExcludePlayerLines([]);
      setFilteredPlayers([]);
      setSubmittedPlayersForOptimizer([])
      setOgFilteredPlayers([]);
    } else {


      const enhancedDataSet = dataSet.map(player => ({
        ...player,
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
      setGameAndPlayerMatchups(updateGameMatchups)

      const injuredPlayers = enhancedDataSet.filter(player => player['Injury Indicator'] !== '');
      const excludedPlayers = enhancedDataSet.filter(player => Number(player.FPPG) <= 2);

      // Players with FPPG not equal to 0
      const remainingPlayers = enhancedDataSet.filter(player => Number(player.FPPG) > 2);

      const requiredHeaders = [
        "Id", "Position", "First Name", "Nickname", "Last Name",
        "FPPG", "Played", "Salary", "Game", "Team", "Opponent",
        "Injury Indicator", "Injury Details", "Tier", "Roster Position"
      ];

      const objectHeaderKeys = [...new Set([...requiredHeaders, ...Object.keys(enhancedDataSet[0])])];




      // const objectHeaderKeys = Object.keys(enhancedDataSet[0]);

      const defaultHeadersConfig = objectHeaderKeys.map((header, index) => ({
        key: header,
        label: header.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "), // This transforms 'First_Name' to 'First Name'
        order: index + 1  // This uses the index as the default order
      }));

      // Set the default headers to state directly without any overriding logic.
      setHeaders(defaultHeadersConfig);



      setData(enhancedDataSet)
      setFilteredInjuredPlayers(injuredPlayers)
      setExcludePlayerLines(excludedPlayers);
      setOgExcludePlayerLines(excludedPlayers);

      setFilteredPlayers(remainingPlayers);
      setSubmittedPlayersForOptimizer(remainingPlayers);
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


  const getSlateFullDirectory = (abbr) => `/mockJson/nba/slates/${abbr}-slate/nbaPlayerList.json`;

  const fetchPlayerSlateDataSet = async (slateType) => {
    const directoryName = slateTypeToDirectory(slateType);
    const slateData1 = getSlateFullDirectory(directoryName)
    // console.log('slateData1', slateData1);
    try {
      const response = await axios.get(slateData1);

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
    let filtered = ogfilteredPlayers;

    if (position !== "All") {
      filtered = filtered.filter(player => player.Position === position);
    }

    // Exclude players that are in excludePlayerLines for both "All" and specific positions
    filtered = filtered.filter(player => !excludePlayerLines.some(excludedPlayer => excludedPlayer.Id === player.Id));

    setFilteredPlayers(filtered);
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



  let handleSubmitPlayers = () => {
    setLoading(true)
    setGetLineupsErr('');

    // console.log('player', filteredPlayers[0]);
    const transformedPlayers = submittedPlayersForOptimizer.map(player => {
      return {
        FPPG: player.FPPG,
        'First Name': player['First Name'],
        Game: player.Game,
        Id: player.Id,
        'Injury Details': player['Injury Details'],
        'Injury Indicator': player['Injury Indicator'],
        isLocked: player.isLocked,
        'Last Name': player['Last Name'],
        // minExposure: player.minExposure,
        // maxExposure: player.maxExposure,
        minExposure: Number(player.minExposure),
        maxExposure: Number(player.maxExposure),
        // minExposure: !player.minExposure ? 0 : Number(player.minExposure),
        // maxExposure: !player.maxExposure || player.maxExposure == 0 ? totalMaxExp : Number(player.maxExposure),
        Nickname: player.Nickname,
        Opponent: player.Opponent,
        Position: player.Position,
        'Roster Position': player["Roster Position"],
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


    // const playerGroupRules = groups.map(group => ({
    //   stackType: 'playerGroup',
    //   players: group,
    //   minFromGroup: 1,
    //   maxExposure: 50
    // }));

    let myargs = {
      numLineups: parseInt(numLineups, 10),
      site: 'FANDUEL',
      sport: 'BASKETBALL',
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
        ...groups,
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
        // `${baseUrl}/optimizer`,
        // "https://bsw-be-api.onrender.com/optimizer",
        "https://testingoptimizer.azurewebsites.net/api/httptrigger1",
        { data: myargs },
        {
          // headers,
          // timeout: 600000  // 10 minutes in milliseconds
        }
      )
      .then((response) => {
        console.log('response.data', response.data);
        if (response.data[0].error) {
          console.error(response.data[0].error);

          setGetLineupsErr(response.data[0].error);
        }
        const fetchedLineups = response.data[response.data[0].error ? 1 : 0].lineups;
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
        console.log('sortedLineupsDes', sortedLineupsDes);
        // const sortedLineupsA = sortByMetricAscending(manipulatedLineups, 'lineup_points')

        const { topPlayers, topTeams } = generateTopPlayersAndTeams(sortedLineupsDes);
        console.log('topPlayers, topTeams', topPlayers, topTeams);
        setTopPlayers(topPlayers);
        setTopTeams(topTeams);


        // setTopTeams(response.data[response.data[0].error ? 2 : 1].top_teams)
        // setTopPlayers(response.data[response.data[0].error ? 2 : 1].top_players)
        // SetTopPlayersAndTeams()
        setLineups({ lineups: sortedLineupsDes });

        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        setGetLineupsErr('Error getting lineups, please try again!');
        console.error(error);
      });
  };

  const generateTopPlayersAndTeams = (lineups) => {
    const playerCount = {};
    const teamCount = {};

    lineups.forEach(lineup => {
      lineup.players.forEach(player => {
        // For each player, increment the total count
        if (playerCount[player.playerId]) {
          playerCount[player.playerId].totalAmt += 1;
        } else {
          playerCount[player.playerId] = {
            playerName: player.playerName,
            playerId: player.playerId,
            totalAmt: 1
          };
        }

        // Increment team count
        if (teamCount[player.playerTeam]) {
          teamCount[player.playerTeam].totalAmt += 1;
        } else {
          teamCount[player.playerTeam] = {
            teamName: player.playerTeam,
            totalAmt: 1
          };
        }
      });
    });

    // Convert the player and team counts to arrays and sort them by totalAmt
    const topPlayers = Object.values(playerCount).sort((a, b) => b.totalAmt - a.totalAmt);
    const topTeams = Object.values(teamCount).sort((a, b) => b.totalAmt - a.totalAmt);

    return { topPlayers, topTeams };
  };

  const exportLineupsToUpload = () => {
    // let amtOfLinesToExport = 350;
    // // let amtOfLinesToExport = amtOfLinesToExport || 350;
    // console.log('lineups', lineups.lineups);
    // const limitedLineups = lineups.lineups.slice(0, amtOfLinesToExport);

    // Here, we're creating an array for each lineup that starts with lineup.totalEverything 
    // followed by all the playerIds.
    const csvData = lineups.lineups.map(lineup => {
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
      'PG',
      'PG',
      'SG',
      'SG',
      'SF',
      'SF',
      'PF',
      'PF',
      'C',
    ];

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
  // console.log('getLineupsErr', getLineupsErr);

  return (
    <ThemeProvider theme={theme}>

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
            <NBATeamStacks
              positions={['QB', 'RB', 'WR', 'TE', 'D']}
              groups={teamGroups}
              gameMatchups={gameAndPlayerMatchups}
              setGroups={setTeamGroups}
              filteredPlayers={filteredPlayers}
              playerGroups={playerGroups}
              setPlayerGroups={setPlayerGroups}
            />
          }
          {tabValue === 2 && <NBATeamGameStacks
            positions={['QB', 'RB', 'WR', 'TE', 'D']}
            groups={teamGameGroups}
            gameMatchups={gameAndPlayerMatchups}
            setGroups={setTeamGameGroups}
            filteredPlayers={filteredPlayers}
            playerGroups={playerGroups}
            setPlayerGroups={setPlayerGroups}
          />}
          {tabValue === 3 && <NBAUploadOwnProjections
            positions={['QB', 'RB', 'WR', 'TE', 'D']}
            groups={teamGameGroups}
            handleFileUpload={handleFileUpload}
            gameMatchups={gameAndPlayerMatchups}
            setGroups={setTeamGameGroups}
            filteredPlayers={filteredPlayers}
            playerGroups={playerGroups}
            data={data}
            setPlayerGroups={setPlayerGroups}

            successUploadOwnProjections={successUploadOwnProjections}
            successUploadOwnProjectionsLoading={successUploadOwnProjectionsLoading}
          />}
        </DialogContent>
      </Dialog>
      <NbaFdDfsOptimizerSettings
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


      {submittedPlayersForOptimizer.length > 0 ? (
        <div>
          {espnScoreBoardMatchupsLoading ? <h3>Loading scoreboard, this may take a moment...</h3> :

            <div style={{ marginBottom: '24px' }}>
              <GameMatchupsCarousel
                // games={gameMatchups}
                games={espnScoreBoardMatchups}
                handleExcludeTeams={handleExcludeTeams}
                excludedTeams={excludedTeams}
                setExcludedTeams={setExcludedTeams}
              />

            </div>}

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
                  <NbaPlayerPosFilter
                    players={data}
                    selectedPosition={position}
                    filterPlayersByPosition={filterPlayersByPosition}
                    onPositionChange={setPosition}
                  />
                </div>}
              <div className="dfs-optimizer-filter-wrapper">
                {isShowingExcludePlayers ?
                  <NbaPlayerSearch
                    data={excludePlayerLines}
                    onSearch={handleSearchExcludedPlayersOnChange}
                    isShowingExcludePlayers={isShowingExcludePlayers}
                  />
                  :
                  <NbaPlayerSearch
                    data={filteredPlayers}
                    onSearch={handleSearchOnChange}
                    isShowingExcludePlayers={isShowingExcludePlayers}
                  />

                }
              </div>
              {/* <div className="dfs-optimizer-filter-wrapper">
                <Button
                  onClick={toggleAllAndExcludedPlayers}
                  className="bsw-primary-btns"
                  variant="contained"
                >
                  {isShowingExcludePlayers ? 'Back to all' : `View ${excludePlayerLines.length} excluded player(s)`}
                </Button>
              </div> */}
              {!isShowingExcludePlayers && <>
                <div className="dfs-optimizer-filter-wrapper">
                  <Button
                    onClick={toggleOptimizerBuildStackPropertiesDrawer}
                    className="bsw-primary-btns"
                    variant="contained"
                  >
                    Optimizer Options
                  </Button>
                </div>
                <div className="dfs-optimizer-filter-wrapper">
                  <Button
                    onClick={() => setOpenModal(true)}
                    className="bsw-primary-btns"
                    variant="contained"
                  >
                    Advanced Settings
                  </Button>
                </div>

                <div className="dfs-optimizer-filter-wrapper">

                  <Button
                    disabled={loading}
                    onClick={handleSubmitPlayers}
                    className="bsw-primary-btns"
                    variant="contained"
                    fullWidth
                    style={{ width: 165 }}
                  >
                    {loading ? "Loading..." : 'Optimize'}
                  </Button>

                </div>
              </>
              }

            </div>
          </div>

          <div style={{ overflow: "auto" }}>

            {getLineupsErr.length !== 0 && <h3>{getLineupsErr}</h3>}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'flex-end'
            }}>

              {tableTabValue === 4 ?
                <p style={{ fontSize: 24 }}>{'Optimized lineups'}</p> :
                <p style={{ fontSize: 24 }}>{selectedSlate} Slate</p>
              }



              <div
                className="table-tab-container"
                style={{
                  // overflowX: 'auto', // this enables horizontal scrolling
                  // whiteSpace: 'nowrap', // this ensures the content doesn't wrap
                }}>


                <Tabs
                  className="table-tabs"
                  style={{ display: 'flex', justifyContent: 'center' }}
                  value={tableTabValue} onChange={handleTableTabChange}>
                  <Tab style={{
                    paddingBottom: '0px'
                  }}

                    label={<span>
                      All
                      <span style={{
                        marginLeft: 5,
                        fontWeight: 'bold'
                      }}>
                        {data.length}
                      </span>
                    </span>} />
                  <Tab style={{
                    paddingBottom: '0px'
                  }}

                    label={<span>
                      My Pool
                      <span style={{
                        marginLeft: 5,
                        fontWeight: 'bold'
                      }}>
                        {submittedPlayersForOptimizer.length}
                      </span>
                    </span>} />
                  <Tab style={{
                    paddingBottom: '0px'
                  }}

                    label={<span>
                      Excluded Players
                      <span style={{
                        marginLeft: 5,
                        fontWeight: 'bold'
                      }}>
                        {excludePlayerLines.length}
                      </span>
                    </span>} />
                  <Tab style={{
                    paddingBottom: '0px'
                  }}

                    label={<span>
                      Injuries
                      <span style={{
                        marginLeft: 5,
                        fontWeight: 'bold'
                      }}>
                        {filteredInjuredPlayers.length}
                      </span>
                    </span>} />


                  {lineups.length !== 0 && (
                    <Tab style={{
                      paddingBottom: '0px'
                    }}

                      label={<span>
                        View Lineups
                        <span style={{
                          marginLeft: 5,
                          fontWeight: 'bold'
                        }}>
                          {lineups.lineups.length}
                        </span>
                      </span>} />


                  )}



                </Tabs>
              </div>
            </div>


            <div style={{ height: '60vh', overflowY: 'auto' }}>

              {/* All Players Table */}
              {tableTabValue === 0 && <TableComponent
                overrides={[
                  { key: 'maxExposure', order: 1 },
                  { key: 'minExposure', order: 2 },
                  { key: 'exclude', order: 3 },
                  { key: 'isLocked', order: 4 },
                  { key: 'FPPG', order: 12 },
                  { key: 'fanduel_value', order: 13 },

                ]}
                columns={columns}
                usingExcludePlayers={false}
                excludedKeys={['Tier', 'Played', 'include', 'exclude', 'OG_FPPG', 'Nickname', 'Tier']}
                headers={headers}
                data={data}
                setData={setData}
                setFilteredPlayers={setFilteredPlayers}
                filteredPlayers={filteredPlayers}
                submittedPlayersForOptimizer={submittedPlayersForOptimizer}
                setSubmittedPlayersForOptimizer={setSubmittedPlayersForOptimizer}
                excludePlayerLines={excludePlayerLines}
                setOgFilteredPlayers={setOgFilteredPlayers}
                ogFilteredPlayers={ogfilteredPlayers}
                setExcludePlayerLines={setExcludePlayerLines} />}

              {/* My Players Table */}
              {tableTabValue === 1 && <TableComponent
                overrides={[
                  { key: 'maxExposure', order: 1 },
                  { key: 'minExposure', order: 2 },
                  { key: 'exclude', order: 3 },
                  { key: 'isLocked', order: 4 },
                  { key: 'FPPG', order: 12 },
                  { key: 'fanduel_value', order: 13 },

                ]}
                columns={columns}
                usingExcludePlayers={false}
                excludedKeys={['Tier', 'Played', 'OG_FPPG', 'Nickname',]}
                headers={headers}
                data={filteredPlayers}
                setData={setData}
                setFilteredPlayers={setFilteredPlayers}
                filteredPlayers={filteredPlayers}
                submittedPlayersForOptimizer={submittedPlayersForOptimizer}
                setSubmittedPlayersForOptimizer={setSubmittedPlayersForOptimizer}
                excludePlayerLines={excludePlayerLines}
                setOgFilteredPlayers={setOgFilteredPlayers}
                ogFilteredPlayers={ogfilteredPlayers}
                setExcludePlayerLines={setExcludePlayerLines} />}

              {/* Exlcude Players Table */}
              {tableTabValue === 2 && <TableComponent
                overrides={[
                  { key: 'maxExposure', order: 1 },
                  { key: 'minExposure', order: 2 },
                  { key: 'include', order: 3 },
                  { key: 'isLocked', order: 4 },
                  { key: 'FPPG', order: 12 },
                  { key: 'fanduel_value', order: 13 },

                ]}
                columns={excludeColumns}
                headers={headers}
                excludedKeys={['Tier', 'Played', 'OG_FPPG', 'Nickname', 'isLocked']}
                data={excludePlayerLines.length !== 0 ? excludePlayerLines : []}
                setData={setData}
                usingExcludePlayers={true}
                setFilteredPlayers={setFilteredPlayers}
                filteredPlayers={filteredPlayers}
                submittedPlayersForOptimizer={submittedPlayersForOptimizer}
                setSubmittedPlayersForOptimizer={setSubmittedPlayersForOptimizer}
                excludePlayerLines={excludePlayerLines}


                setOgFilteredPlayers={setOgExcludePlayerLines}
                ogFilteredPlayers={ogExcludePlayerLines}
                setExcludePlayerLines={setExcludePlayerLines} />}

              {/* Injured Players Table */}
              {tableTabValue === 3 && <TableComponent

                overrides={[
                  { key: 'maxExposure', order: 1 },
                  { key: 'minExposure', order: 2 },
                  { key: 'exclude', order: 3 },
                  { key: 'isLocked', order: 4 },
                  { key: 'FPPG', order: 12 },
                  { key: 'fanduel_value', order: 13 },

                ]}
                columns={excludeColumns}
                headers={headers}
                excludedKeys={['Tier', 'Played', 'minExposure', 'maxExposure', 'include', 'exclude', 'Nickname', 'isLocked']}
                data={filteredInjuredPlayers.length !== 0 ? filteredInjuredPlayers : []}
                setData={setData}
                usingExcludePlayers={true}
                setFilteredPlayers={setFilteredPlayers}
                filteredPlayers={filteredPlayers}
                submittedPlayersForOptimizer={submittedPlayersForOptimizer}
                setSubmittedPlayersForOptimizer={setSubmittedPlayersForOptimizer}
                excludePlayerLines={excludePlayerLines}


                setOgFilteredPlayers={setOgExcludePlayerLines}
                ogFilteredPlayers={ogExcludePlayerLines}
                setExcludePlayerLines={setExcludePlayerLines} />}


              {tableTabValue === 4 && <NBAFanduelDfsLineups
                exportLineupsToUpload={exportLineupsToUpload}
                toggleAndSortData={toggleAndSortData}
                sortDataByAsc={sortDataByAsc}
                sortDataByDec={sortDataByDec}
                exportPlayerLines={exportPlayerLines}
                topPlayers={topPlayers}
                topTeams={topTeams}
                setTopPlayers={setTopPlayers}
                setTopTeams={setTopTeams}
                generateTopPlayersAndTeams={generateTopPlayersAndTeams}
                setLineups={setLineups}
                lineups={lineups}
              />
              }


            </div>

            {/* {isShowingExcludePlayers ? <TableComponent

              overrides={[
                { key: 'include', order: 1 },
                { key: 'FPPG', order: 9 },

              ]}
              columns={excludeColumns}
              headers={headers}
              excludedKeys={['Tier', 'Played', 'OG_FPPG', 'Nickname', 'isLocked']}
              data={excludePlayerLines.length !== 0 ? excludePlayerLines : []}
              setData={setData}
              usingExcludePlayers={true}
              setFilteredPlayers={setFilteredPlayers}
              filteredPlayers={filteredPlayers}
              submittedPlayersForOptimizer={submittedPlayersForOptimizer}
              setSubmittedPlayersForOptimizer={setSubmittedPlayersForOptimizer}
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
                  { key: 'isLocked', order: 4 },
                  { key: 'FPPG', order: 12 },
                  { key: 'fanduel_value', order: 13 },

                ]}
                columns={columns}
                usingExcludePlayers={false}
                excludedKeys={['Tier', 'Played', 'OG_FPPG', 'Nickname',]}
                headers={headers}
                data={filteredPlayers}
                setData={setData}
                setFilteredPlayers={setFilteredPlayers}
                filteredPlayers={filteredPlayers}
                submittedPlayersForOptimizer={submittedPlayersForOptimizer}
                setSubmittedPlayersForOptimizer={setSubmittedPlayersForOptimizer}
                excludePlayerLines={excludePlayerLines}
                setOgFilteredPlayers={setOgFilteredPlayers}
                ogFilteredPlayers={ogfilteredPlayers}
                setExcludePlayerLines={setExcludePlayerLines} />

            } */}


          </div>



        </div>
      ) : null}
    </ThemeProvider>
  );
}
