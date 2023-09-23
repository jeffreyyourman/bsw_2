import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { CSVLink } from "react-csv";
import { useColumns, useExcludeColumns } from "./NflDfsTableColumns";
import { NflPlayerList } from '../../../../mockJson/nfl/nflPlayerList'
import axios from "axios";
import { FiUnlock, FiLock } from "react-icons/fi";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import { TextField, FormHelperText, FormControlLabel, Checkbox, Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import LeftSideDrawer from "../../../drawers/LeftSideDrawer";
import BottomDrawer from "../../../drawers/BottomDrawer";
import GameMatchups from '../../../../mockJson/nfl/nfl-current-games-nextgenstats.json'
import GameMatchupsCarousel from '../../../carousels/GameMatchupCarousel'
import NflPlayerPosFilter from "./NflPlayerPosFilters";
import NFLPlayerSearch from "./NflPlayerSearch";
import { createTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../../../../context/AuthContext';


const useStyles = makeStyles((theme) => ({
  helperText: {
    whiteSpace: "normal",
    wordWrap: "break-word",
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

const TextFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
  );
};

const Table = ({ columns, data, setData, filteredPlayers, setFilteredPlayers, excludePlayerLines, setExcludePlayerLines }) => {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: TextFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    rows,
    prepareRow,
    pageCount,
    gotoPage,
    canPreviousPage,
    previousPage,
    canNextPage,
    nextPage,
    setPageSize,
    pageOptions,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10 },
      // getRowID: (row) => row.name,
    },
    // useFilters,
    useSortBy,
    usePagination
  );



  const handleInputChange = (e, rowIndex, columnId) => {
    const { value } = e.target;
    const column = columns.find((col) => col.accessor === columnId);
    if (!column.editable) {
      return;
    }
    setData((prevData) =>
      prevData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
    setFilteredPlayers((prevData) =>
      prevData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };
  const handleLock = (value, rowIndex, columnId) => {
    const column = columns.find((col) => col.accessor === columnId);
    if (!column.editable) {
      return;
    }
    setData((prevData) =>
      prevData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
    setFilteredPlayers((prevData) =>
      prevData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  function handleInclude(rowIndex) {
    // Copy the excluded players to not directly mutate the state
    let excludedCopy = [...excludePlayerLines];
    const originalPlayers = [...data];
    let playersFilteredCopy = [...filteredPlayers];

    // Get the player to be included
    const includedPlayer = excludedCopy.splice(rowIndex, 1)[0];

    // Add that player back to its original position in the main list
    const originalIndex = originalPlayers.findIndex(player => player.id === includedPlayer.id); // assuming each player has a unique id
    playersFilteredCopy.splice(originalIndex, 0, includedPlayer);

    // Update the state
    setFilteredPlayers(playersFilteredCopy);
    setExcludePlayerLines(excludedCopy);
  }


  function handleExclude(rowIndex) {
    // Assuming data/filteredPlayers is a state variable and you have
    // a setter called setData or setFilteredPlayers, and setExcludePlayers for excludePlayers.

    // Copy the data to not directly mutate the state
    let playersCopy = [...data]; // or [...filteredPlayers]
    let excludedCopy = [...excludePlayerLines];
    // Get the player to be excluded
    const excludedPlayer = playersCopy.splice(rowIndex, 1)[0]; // This will remove the player from playersCopy

    // Add that player to the excludedCopy
    excludedCopy.push(excludedPlayer);
    // Update the state

    setFilteredPlayers(playersCopy)
    setExcludePlayerLines(excludedCopy);
  }

  return (
    <>
      <table className="nfl-table-optimizer" {...getTableProps()}>
        <thead className="nfl-table-header">
          {headerGroups.map((headerGroup) => (
            <tr className="nfl-table-header2"{...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);

            return (
              <tr  {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  const isEditable = cell.column.editable;
                  const cellProps = cell.getCellProps();
                  if (isEditable) {
                    cellProps.className = "editable-cell";
                  }

                  if (cell.column.Header === "Lock") {
                  }
                  return (
                    <td {...cellProps}>
                      {isEditable ? (
                        <>
                          {(() => {
                            if (cell.column.Header === "Lock") {
                              return (
                                <button
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    handleLock(!cell.value, row.index, cell.column.id);
                                  }}
                                >
                                  {cell.value ? (
                                    <FiLock style={{ color: 'red' }} />
                                  ) : (
                                    <FiUnlock style={{ color: 'green' }} />
                                  )}
                                </button>
                              );
                            }
                            if (cell.column.Header === "Exclude") {
                              return (
                                <button
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "transparent",
                                    border: "none",
                                  }}
                                  onClick={(e) => {
                                    handleExclude(row.index);
                                  }}
                                >
                                  <IoMdClose style={{ color: 'red' }} />
                                </button>
                              );
                            }
                            if (cell.column.Header === "Include") {
                              return (
                                <button
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "transparent",
                                    border: "none",
                                  }}
                                  onClick={(e) => {
                                    handleInclude(row.index);
                                  }}
                                >
                                  <IoMdAdd style={{ color: 'green' }} />  {/* <-- This is a placeholder, replace with the appropriate icon */}
                                </button>
                              );
                            }
                            else {
                              return (
                                <input
                                  type="number"
                                  min={0}
                                  max={cell.column.Header === "Projections" ? 200 : 100}
                                  style={{ minWidth: "75px", width: "75px", textAlign: "center" }}
                                  value={cell.value}
                                  onChange={(e) => {
                                    handleInputChange(e, row.index, cell.column.id);
                                  }}
                                />
                              );
                            }
                          })()}
                        </>
                      ) : (
                        cell.render("Cell")
                      )}
                    </td>
                  );

                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50, 100, 150, 300].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default function NFLTable(props) {
  const classes = useStyles();
  const columns = useColumns();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  console.log('isAuthenticated', isAuthenticated);
  const excludeColumns = useExcludeColumns();
  const nflPlayerList = NflPlayerList();
  const [lineups, setLineups] = useState([]);
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

  const [isShowingExcludePlayers, setIsShowingExcludePlayers] = useState(false);
  const [numLineups, setNumLineups] = useState(10);
  const [totalMaxExp, setTotalMaxExp] = useState(100);
  const [randomStd, setrandomStd] = useState(15);
  const [position, setPosition] = useState('All');
  // const [searchFilter, setSearchFilter] = useState('');
  const [excludeOpposingDefense, setExcludeOpposingDefense] = useState(false);
  const [pairQbWithWrOrTe, setPairQbWithWrOrTe] = useState(false);
  const [excludeQbANdRb, setExcludeQbANdRb] = useState(false);
  const [restrict2TEsSameTeam, setRestrict2TEsSameTeam] = useState(false);
  const [maxFromSameTeam, setMaxFromSameTeam] = useState(3);
  // const [anotherCheckbox, setAnotherCheckbox] = useState(false);

  const handleCheckboxChange = (setter) => (event) => {
    setter(event.target.checked);
  };

  useEffect(() => {
    fetchPlayerDataSet(nflPlayerList)
  }, []);

  const fetchPlayerDataSet = (dataSet) => {
    // Players with FPPG equal to 0
    const excludedPlayers = dataSet.filter(player => Number(player.FPPG) <= 2);
    // console.log('excludedPlayers', excludedPlayers);

    // Players with FPPG not equal to 0
    const remainingPlayers = dataSet.filter(player => Number(player.FPPG) > 2);
    // console.log('remainingPlayers', remainingPlayers);
    setData(dataSet)
    setExcludePlayerLines(excludedPlayers);
    setOgExcludePlayerLines(excludedPlayers);
    setFilteredPlayers(remainingPlayers);
    setOgFilteredPlayers(remainingPlayers);
  }

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
        minExposure: !player.minExposure ? 0 : Number(player.minExposure),
        maxExposure: !player.maxExposure || player.maxExposure == 0 ? 100 : Number(player.maxExposure),
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
          positions: ['TE', 'TE'], //Don't want te and te from same team,
          maxExposure: 50
        },
        excludeQbANdRb && {
          stackType: 'restrictSame',
          positions: ['RB', 'QB'], //Don't want te and te from same team,
          maxExposure: 50
        },
        pairQbWithWrOrTe && {
          stackType: 'position',
          positions: ['QB', ['WR', 'TE']],
          maxExposure: 50
        },
        excludeOpposingDefense && {
          stackType: 'restrictOpp',
          team1Pos: ['D'],
          team2Pos: ['QB', 'WR', 'RB', 'TE'],
          maxExposure: 50
        },
      ].filter(Boolean)
    };
    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Bearer yourTokenHere",
    };

    axios
      .post(
        // "https://bsw-be-api.onrender.com/optimizer",
        // "https://anxious-teal-gilet.cyclic.cloud/optimizer",
        "https://testingoptimizer.azurewebsites.net/api/httptrigger1",
        { data: myargs },
        {
          // headers,
          // timeout: 600000  // 10 minutes in milliseconds
        }
      )
      .then((response) => {
        // console.log(response.data[0].lineups);
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

        setLineups(sortedLineupsDes);

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
    const limitedLineups = lineups.slice(0, amtOfLinesToExport);

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

  return (
    <ThemeProvider theme={theme}>
      <LeftSideDrawer
        open={open}
        anchor={'right'}
        handleDrawerOpen={handleDrawerOpen}
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
              <MenuItem disabled={process.env.NODE_ENV !== 'development'} value={500}>500 - Upgrade to use</MenuItem>
              <MenuItem disabled={process.env.NODE_ENV !== 'development'} value={1000}>1000 - Upgrade to use</MenuItem>
            </Select>
            <FormHelperText className={classes.helperText}>
              {!false && `Not Paid account - sign up for the ability to optimize more lines like a shark`}
            </FormHelperText>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={excludeOpposingDefense}
                onChange={handleCheckboxChange(setExcludeOpposingDefense)}
                color="primary"
              />
            }
            label="Exclude Opposing Defense - add positions below it to exclude."
          />
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

          <Box mt={2}> {/* Added for a bit of margin-top for the button */}
            <Button
              disabled={loading}
              onClick={handleSubmitPlayers}
              className="bsw-primary-btns"
              variant="contained"
              fullWidth
            >
              {loading ? "Loading..." : 'Submit'}
            </Button>
          </Box>
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
                </div>}

            </div>
          </div>

          {/* <div style={{ display: "flex" }}>
            <label>numLineups</label>
            <input
              type="number"
              defaultValue={numLineups}
              onChange={(e) => {
                setNumLineups(e.target.value);
              }}
              style={{ width: "100px" }}
            />
          </div> */}



          <div style={{ overflow: "auto" }}>
            {isShowingExcludePlayers ? <Table
              columns={excludeColumns}
              data={excludePlayerLines.length !== 0 ? excludePlayerLines : []}
              setData={setData}
              setFilteredPlayers={setFilteredPlayers}
              filteredPlayers={filteredPlayers}
              excludePlayerLines={excludePlayerLines}

              setExcludePlayerLines={setExcludePlayerLines} />
              :

              <Table
                columns={columns}
                data={filteredPlayers}
                setData={setData}
                setFilteredPlayers={setFilteredPlayers}
                filteredPlayers={filteredPlayers}
                excludePlayerLines={excludePlayerLines}

                setExcludePlayerLines={setExcludePlayerLines} />

            }

            {lineups.length !== 0 && (
              <div style={{ marginTop: "64px" }}>
                <p>total lines: {lineups.length}</p>
                <BottomDrawer
                  exportLineupsToUpload={exportLineupsToUpload}
                  toggleAndSortData={toggleAndSortData}
                  sortDataByAsc={sortDataByAsc}
                  sortDataByDec={sortDataByDec}
                  exportPlayerLines={exportPlayerLines}
                  lineups={lineups} />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </ThemeProvider>
  );
}
