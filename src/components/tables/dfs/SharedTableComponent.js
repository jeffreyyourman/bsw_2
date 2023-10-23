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
  Button} from '@mui/material';

import {
  FiLock,
  FiUnlock
} from "react-icons/fi";
import { IoMdClose, IoMdAdd } from "react-icons/io";

export default function TableComponent(props) {
  let {
    headers,
    data,
    excludedKeys,
    setFilteredPlayers,
    setSubmittedPlayersForOptimizer,
    excludePlayerLines,
    setExcludePlayerLines,
    usingExcludePlayers,
    overrides,
  } = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // rows per page

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
    let playersToSort = [...data];  // start with all players
  
    // Filter by position if the props.selectedPosition is not 'All'
    if (props.selectedPosition !== 'All') {
      playersToSort = playersToSort.filter(player => player.Position.includes(props.selectedPosition));
    }
  
    // If the order is 'default', return the original players list
    if (order === 'default') {
      return playersToSort;
    }
  
    // Sort players based on the order and orderBy values
    return playersToSort.sort((a, b) => {
      // Handle numeric sorting explicitly for fields like FPPG
      if (['FPPG', 'OG_FPPG'].includes(orderBy)) {
        if (order === 'asc') {
          return parseFloat(a[orderBy]) - parseFloat(b[orderBy]);
        } else {
          return parseFloat(b[orderBy]) - parseFloat(a[orderBy]);
        }
      }
  
      // Handle textual sorting (default)
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    });
  }, [data, props.selectedPosition, order, orderBy]);

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


  const basicColumnsMerged = mergeConfigWithOverrides(headers);

  const columnConfig = [
    ...exposureColumnsMerged,
    ...actionColumnsMerged,
    ...basicColumnsMerged
  ];

  columnConfig.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
  const finalColumnConfig = columnConfig.filter(col => !excludedKeys.includes(col.key));


  return (
    <div>
      <TableContainer component={Paper} style={{ width: '100%', height: '90%', overflowY: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {finalColumnConfig.map((col, index) => (
                <TableCell style={{
                  verticalAlign: 'bottom',
                  textAlign: 'center',
                }}

                  key={`${col.key}_${index}`} >
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
            {sortedPlayers.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((player, rowIndex) => (
              <TableRow key={rowIndex}>
                {finalColumnConfig.map((col, innerIndex) => (
                  <TableCell
                    style={{ padding: 12, textAlign: 'center' }}
                    key={innerIndex}>
                    {col.renderer ? col.renderer(player, rowIndex, col.key) : player[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
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