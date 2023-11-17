import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Snackbar,
  Button
} from '@mui/material';

import {
  FiLock,
  FiUnlock
} from "react-icons/fi";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import { SignedIn, SignedOut, UserButton, useClerk, useAuth } from "@clerk/clerk-react";

export default function TableComponent(props) {
  const clerk = useClerk();

  let {
    headers,
    data,
    excludedKeys,
    filteredPlayers,
    setFilteredPlayers,
    setSubmittedPlayersForOptimizer,
    excludePlayerLines,
    setExcludePlayerLines,
    usingExcludePlayers,
    overrides,
  } = props;
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('Value');
  const [page, setPage] = useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = useState(30); // rows per page
  // const [rowsPerPage, setRowsPerPage] = useState(data.length); // rows per page

  const handleSortRequest = (property) => {
    let isAsc = orderBy === property && order === 'asc';
    let isDesc = orderBy === property && order === 'desc';

    if (isAsc) setOrder('desc');
    else if (isDesc) {
      setOrder('default');
      setOrderBy('');
    } else setOrder('asc');

    if (order !== 'desc') {
      setOrderBy(property);
    }
  };
  const sortedPlayers = useMemo(() => {
    // Function to check if a value is numeric
    const isNumeric = (value) => !isNaN(value) && !isNaN(parseFloat(value));

    const customSort = (a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (isNumeric(aValue) && isNumeric(bValue)) {
        const numA = parseFloat(aValue);
        const numB = parseFloat(bValue);
        return order === 'asc' ? numA - numB : numB - numA;
      } else {
        const strA = String(aValue).trim();
        const strB = String(bValue).trim();
        return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      }
    };


    // First, filter by search text if it's not empty
    let playersToFilter = props.searchText
      ? data.filter(player =>
        player.Nickname.toLowerCase().includes(props.searchText.toLowerCase()))
      : [...data];

    // Second, filter by selected position if not 'All'
    if (props.selectedPosition !== 'All') {
      playersToFilter = playersToFilter.filter(player => player.Position.includes(props.selectedPosition));
    }

    // Then sort the resulting array
    console.log('playersToFilter', playersToFilter);
    console.log('orderBy', orderBy);
    return orderBy ? playersToFilter.sort(customSort) : playersToFilter;
  }, [data, props.selectedPosition, order, orderBy, props.searchText]);



  // const sortedPlayers = useMemo(() => {
  //   // First, filter by search text if it's not empty
  //   let playersToFilter = props.searchText
  //     ? data.filter(player =>
  //       player.Nickname.toLowerCase().includes(props.searchText.toLowerCase()))
  //     : [...data]; // or [...data] if data is not the full list

  //   // Second, filter by selected position if not 'All'
  //   if (props.selectedPosition !== 'All') {
  //     playersToFilter = playersToFilter.filter(player => player.Position.includes(props.selectedPosition));
  //   }

  //   // Then sort the resulting array
  //   console.log('playersToFilter',playersToFilter);
  //   return playersToFilter.sort((a, b) => {
  //     // Your existing sorting logic here
  //     if (['FPPG', 'OG_FPPG', 'Value', 'Projected Minutes'].includes(orderBy)) {
  //       return order === 'asc'
  //         ? parseFloat(a[orderBy]) - parseFloat(b[orderBy])
  //         : parseFloat(b[orderBy]) - parseFloat(a[orderBy]);
  //     } else {
  //       if (order === 'asc') {
  //         return a[orderBy] < b[orderBy] ? -1 : 1;
  //       } else {
  //         return a[orderBy] > b[orderBy] ? -1 : 1;
  //       }
  //     }
  //   });
  // }, [data, props.selectedPosition, order, orderBy, props.searchText]);

  // const sortedPlayers = useMemo(() => {
  //   let playersToSort = [...data];  // start with all players

  //   // Filter by position if the props.selectedPosition is not 'All'
  //   if (props.selectedPosition !== 'All') {
  //     playersToSort = playersToSort.filter(player => player.Position.includes(props.selectedPosition));
  //   }

  //   // If the order is 'default', return the original players list
  //   if (order === 'default') {
  //     return playersToSort;
  //   }

  //   // Sort players based on the order and orderBy values
  //   return playersToSort.sort((a, b) => {
  //     // Handle numeric sorting explicitly for fields like FPPG
  //     if (['FPPG', 'OG_FPPG'].includes(orderBy)) {
  //       if (order === 'asc') {
  //         return parseFloat(a[orderBy]) - parseFloat(b[orderBy]);
  //       } else {
  //         return parseFloat(b[orderBy]) - parseFloat(a[orderBy]);
  //       }
  //     }

  //     // Handle textual sorting (default)
  //     if (order === 'asc') {
  //       return a[orderBy] < b[orderBy] ? -1 : 1;
  //     } else {
  //       return a[orderBy] > b[orderBy] ? -1 : 1;
  //     }
  //   });
  // }, [data, props.selectedPosition, order, orderBy]);

  const handleLock = (isLocked, rowIndex) => {
    let updatedPlayers = [...props.submittedPlayersForOptimizer]; // Clone the array
    updatedPlayers[rowIndex].isLocked = isLocked;
    setFilteredPlayers(updatedPlayers);

    setSubmittedPlayersForOptimizer(updatedPlayers); // Update the state
  };

  const handleExclude = (playerId) => {
    let playersCopy = [...props.submittedPlayersForOptimizer]; // Clone the array
    let excludedCopy = [...excludePlayerLines];
    const playerIndex = playersCopy.findIndex((player) => player.Id === playerId);

    if (playerIndex === -1) return;

    const excludedPlayer = playersCopy.splice(playerIndex, 1)[0];
    excludedCopy.push(excludedPlayer);
    setFilteredPlayers(playersCopy);

    setSubmittedPlayersForOptimizer(playersCopy);
    setExcludePlayerLines(excludedCopy);
    // props.filterPlayersByPosition(props.selectedPosition)
  };

  const handleInclude = (playerId) => {
    let excludedCopy = [...excludePlayerLines];
    let playersFilteredCopy = [...props.submittedPlayersForOptimizer]; // Clone the array
    const playerIndex = excludedCopy.findIndex((player) => player.Id === playerId);

    if (playerIndex === -1) return;

    const includedPlayer = excludedCopy.splice(playerIndex, 1)[0];
    playersFilteredCopy.push(includedPlayer);
    setFilteredPlayers(playersFilteredCopy);

    setSubmittedPlayersForOptimizer(playersFilteredCopy);
    setExcludePlayerLines(excludedCopy);
  };
  const removeUnder24Mins = () => {
    let playersCopy = [...props.submittedPlayersForOptimizer]; // Clone the array of players
    console.log('playersCopy', playersCopy);
    console.log('playersCopy', playersCopy);

    // Filter out players with projMins less than 24 and add to existing excluded players
    let newlyExcludedPlayers = playersCopy.filter(player => player['Projected Minutes'] < 24);
    let updatedExcludedCopy = [...props.excludePlayerLines, ...newlyExcludedPlayers];

    // Filter for players with projMins 24 or more and add to existing filtered players
    let newlyFilteredPlayers = playersCopy.filter(player => player['Projected Minutes'] >= 24);
    // let updatedFilteredCopy = [...props.filteredPlayers, ...newlyFilteredPlayers];

    console.log('updatedExcludedCopy', updatedExcludedCopy);
    // console.log('updatedFilteredCopy', updatedFilteredCopy);

    // Update the state with the combined filtered and excluded lists of players
    setFilteredPlayers(newlyFilteredPlayers);
    setSubmittedPlayersForOptimizer(newlyFilteredPlayers);
    setExcludePlayerLines(updatedExcludedCopy);
  };

  const handleMinExposureChange = (playerData, value) => {
    const updatedPlayers = [...props.submittedPlayersForOptimizer];

    const playerDataId = playerData.Id;
    const playerIndex = updatedPlayers.findIndex((player) => player.Id === playerDataId);

    if (playerIndex !== -1) {
      // Modify the player object within the array
      updatedPlayers[playerIndex].minExposure = value;

      // Update the state with the modified array
      setSubmittedPlayersForOptimizer(updatedPlayers);
    }
  };

  const calculateValueForNBA = (projectedPoints, salary) => {
    let salaryInThousands = salary / 1000;
    return projectedPoints / salaryInThousands;
  }

  const calculateValueForNFL = (projectedPoints, salary) => {
    let salaryInThousands = salary / 1000;
    return projectedPoints / (salaryInThousands * 4);
  }

  const calculateValue = (projectedPoints, salary, sport) => {
    // console.log('projectedPoints, salary', projectedPoints, salary);
    switch (sport) {
      case "nba":
        return calculateValueForNBA(projectedPoints, salary);
      case "nfl":
        return calculateValueForNFL(projectedPoints, salary);
      // You can add more cases for other sports
      default:
        return 0; // Default value, adjust as needed
    }
  }
  const handleFPPGChange = (playerData, value) => {
    const updatedPlayers = [...props.submittedPlayersForOptimizer];

    const playerDataId = playerData.Id;
    const playerIndex = updatedPlayers.findIndex((player) => player.Id === playerDataId);

    if (playerIndex !== -1) {
      updatedPlayers[playerIndex].FPPG = parseFloat(value); // Convert the input value to a float
      updatedPlayers[playerIndex].Value = calculateValue(parseFloat(value), updatedPlayers[playerIndex].Salary, props.sport);; // Convert the input value to a float

      setSubmittedPlayersForOptimizer(updatedPlayers);
      setFilteredPlayers(updatedPlayers);
    }
  };

  const handleMaxExposureChange = (playerData, value) => {
    const updatedPlayers = [...props.submittedPlayersForOptimizer];

    const playerDataId = playerData.Id;
    const playerIndex = updatedPlayers.findIndex((player) => player.Id === playerDataId);

    if (playerIndex !== -1) {
      // Modify the player object within the array
      updatedPlayers[playerIndex].maxExposure = value;

      // Update the state with the modified array
      setSubmittedPlayersForOptimizer(updatedPlayers);
    }
  };

  function mergeConfigWithOverrides(config) {
    let tempConfig = [...config]; // Create a temporary copy of the config
    const sortedOverrides = [...overrides].sort((a, b) => a.order - b.order); // Sort overrides by order

    sortedOverrides.forEach(override => {
      // Adjust the orders of columns based on the override's order
      tempConfig = tempConfig.map(col => {
        if (col.order >= override.order) {
          return { ...col, order: col.order + 1 }; // Increment the order by 1
        }
        return col;
      });

      // Find the column in the config that matches the override key and assign the override order
      const matchingColIndex = tempConfig.findIndex(col => col.key === override.key);
      if (matchingColIndex > -1) {
        tempConfig[matchingColIndex] = { ...tempConfig[matchingColIndex], ...override };
      }
    });

    return tempConfig;
  }

  const exposureColumnsMerged = mergeConfigWithOverrides([

    {
      key: 'maxExposure',
      label: 'Max Exposure',
      renderer: (rowData) => (
        <input
          type="number"
          min="0"
          max="100"
          style={{ width: 65 }}
          value={rowData['maxExposure'] || ''}
          onChange={(e) => handleMaxExposureChange(rowData, e.target.value)}
        />
      ),
    },
    {
      key: 'minExposure',
      label: 'Min Exposure',
      renderer: (rowData) => (
        <input
          type="number"
          min="0"
          max="100"
          style={{ width: 65 }}
          value={rowData['minExposure'] || ''}
          onChange={(e) => handleMinExposureChange(rowData, e.target.value)}
        />
      ),
    },
  ]);

  const actionColumnsMerged = mergeConfigWithOverrides([
    {
      key: 'isLocked',
      label: 'Lock',
      renderer: (rowData, rowIndex) => (
        <Button
          style={{
            width: 65,
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => handleLock(!rowData.isLocked, rowIndex, 'isLocked')}
        >
          {rowData.isLocked ? <FiLock style={{ color: 'red' }} /> : <FiUnlock style={{ color: 'green' }} />}
        </Button>
      ),
    },
    {
      key: usingExcludePlayers ? 'include' : 'exclude',
      label: usingExcludePlayers ? 'Include' : 'Exclude',
      renderer: (rowData) => (
        <Button
          style={{
            width: 65,
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
          }}
          // Inside the renderer for your exclude/include button:
          onClick={() => usingExcludePlayers ? handleInclude(rowData.Id) : handleExclude(rowData.Id)}
        >
          {usingExcludePlayers ?
            <IoMdAdd style={{ color: 'green' }} /> :
            <IoMdClose style={{ color: 'red' }} />
          }
        </Button>
      ),
    }
  ]);


  // const basicColumnsMerged = mergeConfigWithOverrides([
  //   ...headers.filter(header => header.key !== 'FPPG'),
  //   {
  //     key: 'FPPG',
  //     label: 'FPPG',
  //     renderer: (rowData) => (
  //       <input
  //         type="number"
  //         // disabled
  //         style={{ width: 65 }}
  //         value={rowData['FPPG'] || ''}
  //         onChange={(e) => handleFPPGChange(rowData, e.target.value)}
  //       />
  //     ),
  //   },
  // ]);


  const basicColumnsMerged = mergeConfigWithOverrides([
    ...headers.filter(header => header.key !== 'FPPG' && header.key !== 'Value'),
    {
      key: 'FPPG',
      label: 'FPPG',
      renderer: (rowData) => (
        <input
          type="number"
          // disabled
          style={{ width: 65 }}
          value={rowData['FPPG'] || ''}
          onChange={(e) => handleFPPGChange(rowData, e.target.value)}
        />
      ),
    },
    {
      key: 'Value',
      label: 'Value',
      renderer: (rowData) => {
        // const playerValue = calculateValue(rowData['FPPG'], rowData['Salary'], props.sport);
        return <span>{rowData['Value'].toFixed(2) || ''}</span>;
        // return <span>{playerValue.toFixed(2)}</span>;
      },
    },
  ]);




  const columnConfig = [
    ...exposureColumnsMerged,
    ...actionColumnsMerged,
    ...basicColumnsMerged
  ];

  columnConfig.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
  const finalColumnConfig = columnConfig.filter(col => !excludedKeys.includes(col.key));

  console.log('filteredPlayers', filteredPlayers);
  console.log('sortedPlayers', sortedPlayers);

  return (
    <div>
      <TableContainer component={Paper} style={{ width: '100%', height: '90%', overflowY: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {finalColumnConfig.map((col, index) => (
                <TableCell style={{ verticalAlign: 'bottom', textAlign: 'center' }}
                  key={`${col.label}_${col.key}_${index}`} >
                  <TableSortLabel
                    align="left"
                    active={orderBy === col.key}
                    direction={order}
                    onClick={() => handleSortRequest(col.key)}
                    style={{ flexDirection: 'column-reverse', padding: 10, textAlign: 'center', verticalAlign: 'bottom' }}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.length > 0 ? (
              sortedPlayers.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((player, rowIndex) => (
                <TableRow key={rowIndex}>
                  {finalColumnConfig.map((col, innerIndex) => (
                    <TableCell
                      style={{ padding: 12, textAlign: 'center' }}
                      key={`${player.Id}_${col.key}_${innerIndex}`}>
                      {col.renderer ? col.renderer(player, rowIndex, col.key) : player[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={finalColumnConfig.length} style={{ textAlign: 'left' }}>
                  No players found in this search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <div>
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={event => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);  // reset to first page
            }}
          >
            {[5, 10, 30, 50, 100, 300, 500, sortedPlayers.length].map(rows => (
              <option key={rows} value={rows}>
                {rows === sortedPlayers.length ? 'All' : rows}
              </option>
            ))}
          </select>
        </div>
        <div>

          <Button
            // variant="contained"
            // color="primary"
            style={{ marginRight: 8 }}
            onClick={props.resetMinExposureValues}>
            Reset Min Exposure Values
          </Button>
          <Button
            // variant="contained"
            // color="primary"
            onClick={props.resetMaxExposureValues}>
            Reset Max Exposure Values
          </Button>

          {clerk?.user?.primaryEmailAddress?.emailAddress === 'jeffreyyourman@gmail.com' && <>

            <Button
              // variant="contained"
              // color="primary"
              onClick={props.everyonePlays}>
              Everyone Plays
            </Button>

            <Button
              // variant="contained"
              // color="primary"
              onClick={removeUnder24Mins}>
              remove under 24 mins
            </Button>

          </>}


        </div>
        <div>
          <Button onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0}>
            Previous
          </Button>
          {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, sortedPlayers.length)} of ${sortedPlayers.length}`}
          <Button onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(sortedPlayers.length / rowsPerPage) - 1))} disabled={page >= Math.floor(sortedPlayers.length / rowsPerPage)}>
            Next
          </Button>



          <Snackbar
            open={props.isSnackbarOpen}
            autoHideDuration={3000}
            onClose={() => props.setIsSnackbarOpen(false)}
            message="Exposure values reset successfully!"
            action={
              <Button color="secondary" size="small" onClick={() => props.setIsSnackbarOpen(false)}>
                Close
              </Button>
            }
          />

        </div>
      </div>

    </div>
  );
}