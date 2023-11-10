import React, { useState, useEffect } from "react";
import { useColumns, useExcludeColumns } from "./DfsNbaTableColumns";
import axios from "axios";
import {
  Button,
  Snackbar
} from '@mui/material';
import Papa from 'papaparse';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PlayerGroups from './PlayerGroupsNba.js';
import TeamStacksNba from './TeamStacksNba.js';
import TeamGameStacksNba from './TeamGameStacksNba.js';
import UploadProjectionsNba from './UploadProjectionsNba.js';
import TableComponent from '../SharedTableComponent';
import DfsNbaFdOptimizerSettings from './DfsNbaFdOptimizerSettings.js';

import GameMatchupsCarousel from '../../../carousels/GameMatchupCarousel'
import PlayerPosFilterNba from "./PlayerPosFilterNba";
import DfsNbaFdLineups from "./DfsNbaFdLineups";
import PlayerSearchNba from "./PlayerSearchNba";
import { createTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
// import { useAuth } from '../../../../context/AuthContext';
import { SignedIn, SignedOut, UserButton, useClerk, useAuth } from "@clerk/clerk-react";
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

const SPORT_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];


export default function DfsFanduelNba(props) {
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
  // const { isLoaded, userId, sessionId, getToken, user } = useAuth();
  const auth = useAuth();
  // console.log('clerk', clerk.user);
  // console.log('clerk', clerk?.user?.primaryEmailAddress?.emailAddress);
  // console.log('auth', auth);
  // console.log('user',user);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [tabValue, setTabValue] = useState(0);
  const [tableTabValue, setTableTabValue] = useState(1);
  const [playerGroups, setPlayerGroups] = useState([]);
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


  // const { isAuthenticated, setIsAuthenticated } = useAuth();
  const excludeColumns = useExcludeColumns();
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
  const [numLineups, setNumLineups] = useState(5);
  const [totalMaxExp, setTotalMaxExp] = useState(50);
  const [randomStd, setrandomStd] = useState(30);
  const [currentPosition, setCurrentPosition] = useState('All');
  const [restrict2CsSameTeam, setRestrict2CsSameTeam] = useState(false);
  const [maxFromSameTeam, setMaxFromSameTeam] = useState(3);
  const [selectedSlate, setSelectedSlate] = useState('Main');
  const [selectedSlateData, setSelectedSlateData] = useState(null);
  const [dailyFantasyFuelPlayerProjs, setDailyFantasyFuelPlayerProjs] = useState(null);

  const [includeGlobalGameStack, setIncludeGlobalGameStack] = useState(false);
  const [globalNumPlayers, setGlobalNumPlayers] = useState(4);
  const [globalMinFromTeam, setGlobalMinFromTeam] = useState(1);
  const [globalMaxExposure, setGlobalMaxExposure] = useState(50);

  const [headers, setHeaders] = useState([]);
  const [gameAndPlayerMatchups, setGameAndPlayerMatchups] = useState([]);
  const [espnScoreBoardMatchups, setEspnScoreBoardMatchups] = useState([]);
  const [espnScoreBoardMatchupsLoading, setEspnScoreBoardMatchupsLoading] = useState(false);
  const [fdSlates, setFdSlates] = useState([]);
  const [espnScoreboard, setEspnScoreboard] = useState([]);
  const [espnStandings, setEspnStandings] = useState([]);
  const [successUploadOwnProjections, setSuccessUploadOwnProjections] = useState(false);
  const [successUploadOwnProjectionsLoading, setSuccessUploadOwnProjectionsLoading] = useState(false);
  const [getLineupsErr, setGetLineupsErr] = useState('');
  const getEspnScoreboard = (abbr) => `/mockJson/nba/2023-espn-scoreboard.json`;
  const getEspnStandings = (abbr) => `/mockJson/nba/2023-espn-standings.json`;
  const [searchText, setSearchText] = useState('');



  const fetchFdSlates = async () => {
    try {

      const response = await axios.get(`${baseUrl}/dfs-projections/nba/fd/upcoming-slates`);

      // console.log('fetchfanduel slate lists - response - ', response.data);

      let selectedSlate = 'main';
      // Find the first slate with "main" in slate_type
      const mainSlate = response.data.data.find((slate) => slate.slate_type.toLowerCase().includes("main"));
      if (mainSlate) {
        selectedSlate = mainSlate;
      } else {
        // If no main slate is found, find the first available slate without showdown_flag
        const availableSlate = response.data.data.find((slate) => slate.showdown_flag === 0);

        if (availableSlate) {
          selectedSlate = availableSlate;
        } else {
          console.log("No suitable slate found.");
          // You can handle the case where no suitable slate is found here.
        }
      }

      // console.log("Selected Slate:", selectedSlate);
      setSelectedSlateData(selectedSlate);
      fetchDailyFantasyFuelPlayerProjections(selectedSlate)

      if (Object.keys(response.data).length === 0) {
        setFdSlates([]);
      } else {
        setFdSlates(response.data.data);
        // call projections inside here and inside there align the fppg here. 
        // then make the call for here once the mapping of the projections and Ids happen
      }
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };



  const fetchDailyFantasyFuelPlayerProjections = async (selectedSlateParam) => {
    console.log('selectedSlateParam', selectedSlateParam);
    // console.log(`${baseUrl}/dfs-projections/nba/fd/slate-playerlist/${selectedSlateParam.url}`)

    try {

      const response = await axios.get(`${baseUrl}/dfs-projections/nba/fd/slate-playerlist/${selectedSlateParam.url}`);
      // const response = await axios.get(fdSlateList); 

      // console.log('fetchfanduel player projections list daily fantasy - response - ', response.data);
      if (Object.keys(response.data).length === 0) {

        setDailyFantasyFuelPlayerProjs([]);
      } else {
        setDailyFantasyFuelPlayerProjs(response.data.data);
        fetchPlayerSlateDataSet(selectedSlate, response.data.data);
      }
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
    }
  };
  
  const fetchGameMatchups = async () => {
    setEspnScoreBoardMatchupsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/dfs-projections/nba/espn-scoreboard`);

      // console.log('get game matchups slate lists - response - ', response.data.data.sports[0].leagues[0].events);
      if (Object.keys(response.data).length === 0) {
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

  const fetchEspnStandings = async () => {
    const getEspnStandingsRes = getEspnStandings()

    try {
      const response = await axios.get(getEspnStandingsRes);


      if (Object.keys(response.data).length === 0) {
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
    fetchFdSlates()
    fetchEspnStandings();

  }, [selectedSlate]);

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
      const formattedData = rows.map((row) => {
        // Convert fantasy points per game to numbers
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

      console.log('formattedData', formattedData);

      fetchPlayerDataSet(mergedData);
      setOpen(false);
      setSuccessUploadOwnProjections(true)
      setSuccessUploadOwnProjectionsLoading(false)

    }
    reader.readAsText(file);
  };




  const fetchPlayerDataSet = (dataSet, projectionsToMatch) => {
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


      const requiredHeaders = [
        "Id",
        "Position",
        "First Name",
        "Nickname",
        "Last Name",
        // "FPPG",
        "Played",
        "Value",
        "Salary",
        "Game",
        "Team",
        'projected_team_score',
        "Opponent",
        "Injury Indicator",
        "Injury Details",
        "Tier",
        "Roster Position",
        'opp_rank',
        "opp_rank_bucket",
        // "projMins",
        'days_rest',
        'lineupUsg'
      ];




      const objectHeaderKeys = [...new Set([...requiredHeaders, ...Object.keys(enhancedDataSet[0])])];


      const defaultHeadersConfig = objectHeaderKeys.map((header, index) => ({
        key: header,
        label: header.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "), // This transforms 'First_Name' to 'First Name'
        order: index + 1  // This uses the index as the default order
      }));


      enhancedDataSet.map((player) => {
        const playerName = `${player["First Name"]} ${player["Last Name"]}`;

        player.FPPG = parseFloat(player.FPPG);
        player.Value = parseFloat(player.Value);
        player["Projected Minutes"] = parseFloat(player["Projected Minutes"]);

        if (player['Injury Indicator'] === 'O' || player['Injury Indicator'] === 'D' || player['Injury Indicator'] === 'IR') {
          // If the player has an Injury Indicator of "O", set FPPG to 0
          player.FPPG = 0;
          return player; // Return the player immediately without further checks
        }

        // console.log('projectionsToMatch', projectionsToMatch);
        // projections to match will soon be our own projections
        if (projectionsToMatch && projectionsToMatch.length !== 0) {
          const isPlayerInProjections = projectionsToMatch.some((projection) => {
            const projectionsToMatchName = `${projection.first_name} ${projection.last_name}`;
            return playerName === projectionsToMatchName;
          });

          if (isPlayerInProjections) {
            // Player is in projectionsToMatch, update properties as needed

            projectionsToMatch.forEach((projection) => {
              // console.log('projection', projection)
              const projectionsToMatchName = `${projection.first_name} ${projection.last_name}`;
              if (playerName === projectionsToMatchName) {
                // Update player properties based on projection data
                // player.FPPG = projection.ppg;
                // player.Value = projection.value;
                player.opp_rank = projection.opp_rank;
                player.days_rest = projection.days_rest;
                player.opp_rank_bucket = projection.opp_rank_bucket;
                player.projected_team_score = projection.projected_team_score;
                // Add more properties as needed
              }
            });
          }

          return player;
        }
      });


      // Check if player is in projectionsToMatch based on name
      console.log('dataSet', dataSet);
      console.log('enhancedDataSet', enhancedDataSet);
      // Set the default headers to state directly without any overriding logic.
      const injuredPlayers = enhancedDataSet.filter(player => player['Injury Indicator'] !== '');

      let excludedPlayers;
      let remainingPlayers;


      excludedPlayers = enhancedDataSet.filter(player => Number(player.FPPG) <= 2);
      remainingPlayers = enhancedDataSet.filter(player => Number(player.FPPG) > 2);


      setData(enhancedDataSet)
      setFilteredInjuredPlayers(injuredPlayers)
      setExcludePlayerLines(excludedPlayers);
      setOgExcludePlayerLines(excludedPlayers);

      setFilteredPlayers(remainingPlayers);
      setSubmittedPlayersForOptimizer(remainingPlayers);
      setOgFilteredPlayers(remainingPlayers);


      setHeaders(defaultHeadersConfig);
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

  const getSlateFullDirectory = (abbr) => `/mockJson/nba/slates/${abbr}-slate/nbaPlayerList.csv`;  // Change extension to .csv

  const fetchPlayerSlateDataSet = async (slateType, additionalProjections) => {
    const directoryName = slateTypeToDirectory(slateType);
    const slateData1 = getSlateFullDirectory(directoryName);

    try {
      const response = await axios.get(slateData1);

      // Convert fetched CSV data to JSON format
      const csvData = response.data;
      const parsedData = Papa.parse(csvData, {
        header: true, // Convert rows to objects
        dynamicTyping: true, // Convert strings to numbers or booleans when appropriate
        skipEmptyLines: true
      });
      console.log('parsedData', parsedData);

      let formattedData = parsedData.data.filter(obj => obj.Id !== null && obj.Id !== '');

      // Convert fantasy points per game to numbers (if this is still needed) and remove unwanted keys
      formattedData = formattedData.map(row => {

        // Delete the unwanted property
        if (row[""] !== undefined) {
          delete row[""];
        }

        if (row["_1"] !== undefined) {
          delete row["_1"];
        }

        return row;
      });
      console.log('formattedData', formattedData);
      // At this point, formattedData has the converted CSV-to-JSON data
      if (formattedData.length === 0) {
        console.log('no data found');
      } else {
        fetchPlayerDataSet(formattedData, additionalProjections);
      }

    } catch (error) {
      console.error("Error fetching the CSV data:", error);
    }
  };

  const handleSearchOnChange = (text) => {
    if (currentPosition !== 'All') setCurrentPosition('All')
    if (excludedTeams.length !== 0) setExcludedTeams([])
    let searchTextLowerCase = text.toLowerCase();
    setSearchText(searchTextLowerCase);

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


  const resetMinExposureValues = () => {
    const resetPlayers = submittedPlayersForOptimizer.map(player => {
      return {
        ...player,
        minExposure: '',
        maxExposure: player.maxExposure
      };
    });

    setFilteredPlayers(resetPlayers);
    setSubmittedPlayersForOptimizer(resetPlayers);
    setOgFilteredPlayers(resetPlayers);

    setSubmittedPlayersForOptimizer(resetPlayers);
    setIsSnackbarOpen(true); // Open the snackbar
  };
  const resetMaxExposureValues = () => {
    const resetPlayers = submittedPlayersForOptimizer.map(player => {
      return {
        ...player,
        minExposure: player.minExposure,
        maxExposure: ''
      };
    });

    setFilteredPlayers(resetPlayers);
    setSubmittedPlayersForOptimizer(resetPlayers);
    setOgFilteredPlayers(resetPlayers);
    setIsSnackbarOpen(true); // Open the snackbar
  };
  const everyonePlays = () => {
    const resetPlayers = submittedPlayersForOptimizer.map(player => {
      return {
        ...player,
        minExposure: 1,
        maxExposure: player.maxExposure
      };
    });

    setFilteredPlayers(resetPlayers);
    setSubmittedPlayersForOptimizer(resetPlayers);
    setOgFilteredPlayers(resetPlayers);
    setIsSnackbarOpen(true); // Open the snackbar
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
        Nickname: player.Nickname,
        Opponent: player.Opponent,
        Position: player.Position,
        'Roster Position': player["Roster Position"],
        Salary: player.Salary,
        Team: player.Team,
        Tier: player.Tier,
        playerStats: {
          fppg: player.FPPG,
          'projMins': player['Projected Minutes'],

        }
      };
    });

    const enabledGroups = groups.filter(group => group.enabled);
    const enabledTeamGroups = teamGroups.filter(group => group.enabled);
    const enabledTeamGameGroups = teamGameGroups.filter(group => group.enabled);

    let myargs = {
      numLineups: parseInt(numLineups, 10),
      site: 'FANDUEL',
      sport: 'BASKETBALL',
      totalMaxExp,
      randomStd,
      players: transformedPlayers,
      maxFromSameTeam: maxFromSameTeam > 4 || maxFromSameTeam < 1 ? 3 : maxFromSameTeam,

      rules: [
        restrict2CsSameTeam && {
          stackType: 'restrictSame',
          positions: ['C', 'C'],
        },
        includeGlobalGameStack && {
          stackType: 'game',
          numPlayers: globalNumPlayers,
          minFromTeam: globalMinFromTeam,
          maxExposure: globalMaxExposure,
        },
        ...enabledGroups,
        ...enabledTeamGroups,
        ...enabledTeamGameGroups,
      ].filter(Boolean)
    };
    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Bearer yourTokenHere",
    };

    axios
      .post(
        // `${baseUrl}/optimizer`,
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
          let totalProjMins = 0;

          lineup.players.forEach(player => {
            const stats = player.playerStats;
            // console.log('new - stats - ', stats);
            stats.fppg = Number(stats.fppg);
            stats.projMins = Number(stats['projMins']);

            totalfppg += stats.fppg;
            totalProjMins += stats.projMins;
          });
          // console.log('total projMins', totalProjMins);

          return {
            ...lineup,
            totalfppg,
            totalProjMins,

          };


        });
        const sortedLineupsDes = sortByMetricDescending(manipulatedLineups, 'lineup_points')



        const { topPlayers, topTeams } = generateTopPlayersAndTeams(sortedLineupsDes);

        const updatedSubmittedPlayers = submittedPlayersForOptimizer.map(player => {
          const topPlayer = topPlayers.find(top => top.playerName === player.Nickname);

          const lineupUsg = topPlayer
            ? `${(topPlayer.totalAmt / numLineups * 100).toFixed(2)}%`
            : '';

          const updatedPlayer = { ...player, lineupUsg };

          // console.log(`Updating player ${player.Nickname}: `, updatedPlayer);
          return updatedPlayer;
        });
        // console.log('updatedSubmittedPlayers', updatedSubmittedPlayers);

        // setData(enhancedDataSet)

        setFilteredPlayers(updatedSubmittedPlayers);
        // setSubmittedPlayersForOptimizer(updatedSubmittedPlayers);
        // setOgFilteredPlayers(updatedSubmittedPlayers);

        setTopPlayers(topPlayers);
        setTopTeams(topTeams);


        setLineups({ lineups: sortedLineupsDes });

        setLoading(false)
        setTableTabValue(4);
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
              baseUrl={baseUrl}
            />
          )}

          {tabValue === 1 &&
            <TeamStacksNba
              positions={SPORT_POSITIONS}
              groups={teamGroups}
              gameMatchups={gameAndPlayerMatchups}
              setGroups={setTeamGroups}
              filteredPlayers={filteredPlayers}
              playerGroups={playerGroups}
              setPlayerGroups={setPlayerGroups}
              baseUrl={baseUrl}
            />
          }
          {tabValue === 2 && <TeamGameStacksNba
            positions={SPORT_POSITIONS}
            groups={teamGameGroups}
            gameMatchups={gameAndPlayerMatchups}
            setGroups={setTeamGameGroups}
            filteredPlayers={filteredPlayers}
            playerGroups={playerGroups}
            setPlayerGroups={setPlayerGroups}
            baseUrl={baseUrl}
          />}
          {tabValue === 3 && <UploadProjectionsNba
            positions={SPORT_POSITIONS}
            groups={teamGameGroups}
            handleFileUpload={handleFileUpload}
            gameMatchups={gameAndPlayerMatchups}
            setGroups={setTeamGameGroups}
            filteredPlayers={filteredPlayers}
            playerGroups={playerGroups}
            data={data}
            setPlayerGroups={setPlayerGroups}
            baseUrl={baseUrl}

            successUploadOwnProjections={successUploadOwnProjections}
            successUploadOwnProjectionsLoading={successUploadOwnProjectionsLoading}
          />}
        </DialogContent>
      </Dialog>
      <DfsNbaFdOptimizerSettings
        open={open}
        anchor={'right'}
        selectedSlateData={selectedSlateData}
        setSelectedSlateData={setSelectedSlateData}
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
        handleCheckboxChange={handleCheckboxChange}
        restrict2CsSameTeam={restrict2CsSameTeam}
        setRestrict2CsSameTeam={setRestrict2CsSameTeam}
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
                  <PlayerPosFilterNba
                    players={data}
                    pos={SPORT_POSITIONS}
                    selectedPosition={currentPosition}

                    onPositionChange={setCurrentPosition}
                  />
                </div>}
              <div className="dfs-optimizer-filter-wrapper">
                {isShowingExcludePlayers ?
                  <PlayerSearchNba
                    data={excludePlayerLines}
                    onSearch={handleSearchOnChange}
                    isShowingExcludePlayers={isShowingExcludePlayers}
                    searchText={searchText}
                  />
                  :
                  <PlayerSearchNba
                    data={filteredPlayers}
                    onSearch={handleSearchOnChange}
                    isShowingExcludePlayers={isShowingExcludePlayers}
                    searchText={searchText}
                  />

                }
              </div>

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



              <div className="table-tab-container">


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

                      label={<span style={{ color: 'red', fontSize: 16 }}>
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

            <div
            //  style={{ height: '70vh', overflowY: 'auto' }}
            >

              {/* All Players Table */}
              {tableTabValue === 0 && <TableComponent
                overrides={[
                  { key: 'minExposure', order: 1 },
                  { key: 'maxExposure', order: 2 },
                  { key: 'exclude', order: 3 },
                  { key: 'isLocked', order: 4 },
                  { key: 'FPPG', order: 12 },
                  { key: 'Value', order: 14 },

                  { key: 'Projected Minutes', order: 13 },

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
                positionFilter={currentPosition}
                setExcludePlayerLines={setExcludePlayerLines}
                setIsSnackbarOpen={setIsSnackbarOpen}
                isSnackbarOpen={isSnackbarOpen}
                resetMinExposureValues={resetMinExposureValues}
                resetMaxExposureValues={resetMaxExposureValues}
                selectedPosition={currentPosition}
                everyonePlays={everyonePlays}
                sport={'nba'}
                searchText={searchText}

              />

              }

              {/* My Players Table */}
              {tableTabValue === 1 && <TableComponent
                overrides={[
                  { key: 'minExposure', order: 1 },
                  { key: 'maxExposure', order: 2 },
                  { key: 'exclude', order: 3 },
                  { key: 'isLocked', order: 4 },
                  { key: 'FPPG', order: 12 },
                  { key: 'Value', order: 14 },
                  { key: 'Projected Minutes', order: 13 },


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
                positionFilter={currentPosition}
                setExcludePlayerLines={setExcludePlayerLines}
                setIsSnackbarOpen={setIsSnackbarOpen}
                isSnackbarOpen={isSnackbarOpen}
                resetMinExposureValues={resetMinExposureValues}
                resetMaxExposureValues={resetMaxExposureValues}
                selectedPosition={currentPosition}
                everyonePlays={everyonePlays}
                sport={'nba'}
                searchText={searchText}


              />

              }

              {/* Exlcude Players Table */}
              {tableTabValue === 2 && <TableComponent
                overrides={[
                  { key: 'minExposure', order: 1 },
                  { key: 'maxExposure', order: 2 },
                  { key: 'include', order: 3 },
                  { key: 'isLocked', order: 4 },
                  { key: 'FPPG', order: 12 },
                  { key: 'Value', order: 14 },
                  { key: 'Projected Minutes', order: 13 },


                ]}
                columns={excludeColumns}
                headers={headers}
                excludedKeys={['Tier', 'Played', 'OG_FPPG', 'Nickname', 'isLocked', 'minExposure', 'maxExposure',]}
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
                positionFilter={currentPosition}
                setExcludePlayerLines={setExcludePlayerLines}
                setIsSnackbarOpen={setIsSnackbarOpen}
                isSnackbarOpen={isSnackbarOpen}
                resetMinExposureValues={resetMinExposureValues}
                resetMaxExposureValues={resetMaxExposureValues}
                selectedPosition={currentPosition}
                everyonePlays={everyonePlays}
                sport={'nba'}
                searchText={searchText}


              />

              }

              {/* Injured Players Table */}
              {tableTabValue === 3 && <TableComponent

                overrides={[
                  { key: 'minExposure', order: 1 },
                  { key: 'maxExposure', order: 2 },
                  { key: 'exclude', order: 3 },
                  { key: 'isLocked', order: 4 },
                  { key: 'FPPG', order: 12 },
                  { key: 'Value', order: 14 },

                  { key: 'Projected Minutes', order: 13 },

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
                positionFilter={currentPosition}
                setExcludePlayerLines={setExcludePlayerLines}
                setIsSnackbarOpen={setIsSnackbarOpen}
                isSnackbarOpen={isSnackbarOpen}
                resetMinExposureValues={resetMinExposureValues}
                resetMaxExposureValues={resetMaxExposureValues}
                selectedPosition={currentPosition}
                everyonePlays={everyonePlays}
                sport={'nba'}
                searchText={searchText}

              />

              }


              {tableTabValue === 4 && <DfsNbaFdLineups

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
                baseUrl={baseUrl}
              />
              }

            </div>
          </div>
        </div>
      ) : null}
    </ThemeProvider>
  );
}