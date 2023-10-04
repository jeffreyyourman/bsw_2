import React, { useEffect,useMemo, useState } from "react";
import { CSVLink } from "react-csv";
// import {

// } from '@material-ui/core';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  TableSortLabel,
  Tabs,
  Tab,
  Drawer,
  Box,
  TextField,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

import lodashOrderBy from 'lodash/orderBy';
import {
  FiLock,
  FiUnlock
} from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

export default function TableComponent(props) {
  let {
    headers,
    columns,
    data,
    setOgFilteredPlayers,
    ogFilteredPlayers,
    excludedKeys,
    setData,
    filteredPlayers,
    setFilteredPlayers,
    excludePlayerLines,
    setExcludePlayerLines
  } = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // rows per page

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

  // let sortedPlayers;
  // if (order === 'default') {
  //   sortedPlayers = ogFilteredPlayers
  // } else {
  //   sortedPlayers = [...filteredPlayers].sort((a, b) => {
  //     // If we have a default sort, just return the original order
  //     if (order === 'default') return 0;

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
  // }

  const sortedPlayers = useMemo(() => {
    if (order === 'default') {
      return ogFilteredPlayers;
    }

    return [...filteredPlayers].sort((a, b) => {
      // If we have a default sort, just return the original order
      if (order === 'default') return 0;

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
  }, [filteredPlayers, order, orderBy]);
  // }, [filteredPlayers, order, orderBy, ogFilteredPlayers]);


  const handleLock = (isLocked, rowIndex) => {
    let updatedPlayers = [...filteredPlayers];
    updatedPlayers[rowIndex].isLocked = isLocked;
    setFilteredPlayers(updatedPlayers);
  };

  const handleExclude = (rowIndex) => {
    // Copy the data to not directly mutate the state
    let playersCopy = [...filteredPlayers];
    let excludedCopy = [...excludePlayerLines];

    // Get the player to be excluded
    const excludedPlayer = playersCopy.splice(rowIndex, 1)[0];

    // Add that player to the excludedCopy
    excludedCopy.push(excludedPlayer);

    // Update the state
    setFilteredPlayers(playersCopy);
    setExcludePlayerLines(excludedCopy);
  };


  const handleMinExposureChange = (playerData, value) => {
    let updatedPlayers = [...sortedPlayers];
    let playerDataId = playerData.id;
    let player = updatedPlayers.find(player => player.id === playerDataId);

    player.minExposure = value;  // Assuming 'value' is already defined earlier in your code

    const playerIndex = updatedPlayers.findIndex(player => player.id === playerDataId);
    updatedPlayers[playerIndex] = player;

    setFilteredPlayers(updatedPlayers);


  };
  const handleMaxExposureChange = (playerData, value) => {
    let updatedPlayers = [...sortedPlayers];
    let playerDataId = playerData.id;
    let player = updatedPlayers.find(player => player.id === playerDataId);

    player.maxExposure = value;  // Assuming 'value' is already defined earlier in your code

    const playerIndex = updatedPlayers.findIndex(player => player.id === playerDataId);
    updatedPlayers[playerIndex] = player;

    setFilteredPlayers(updatedPlayers);


  };


  // const excludedKeys = ['',];

  const basicColumns = headers.map(header => ({
    key: header,
    label: header.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") // Transform 'First_Name' to 'First Name'
  }));

  const exposureColumns = [
    {
      key: 'minExposure',
      label: 'Min Exposure',
      renderer: (rowData) => (
        <input
          type="text"
          min="0"
          max="100"
          value={rowData['minExposure'] || ''}
          onChange={(e) => handleMinExposureChange(rowData, e.target.value)}
        />
      ),
    },
    {
      key: 'maxExposure',
      label: 'Max Exposure',
      renderer: (rowData) => (
        <input
          type="text"
          min="0"
          max="100"
          value={rowData['maxExposure'] || ''}
          onChange={(e) => handleMaxExposureChange(rowData, e.target.value)}
        />
      ),
    }
  ];

  const actionColumns = [
    {
      key: 'isLocked',
      label: 'Lock',
      renderer: (rowData, rowIndex) => (
        <Button
          style={{
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
      key: 'exclude',
      label: 'Exclude',
      renderer: (rowData, rowIndex) => (
        <Button
          style={{
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
          }}
          onClick={() => handleExclude(rowIndex)}
        >
          <IoMdClose style={{ color: 'red' }} />
        </Button>
      ),
    },
  ];

  const columnConfig = [...exposureColumns, ...actionColumns, ...basicColumns];

  // Filter out the excluded columns
  const finalColumnConfig = columnConfig.filter(col => !excludedKeys.includes(col.key));

  return (
    <div>
      <TableContainer component={Paper} style={{ width: '100%', height: '90%', overflowY: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {finalColumnConfig.map((col, index) => (
                <TableCell key={index}>
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={order}
                    onClick={() => handleSortRequest(col.key)}
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
                  <TableCell key={innerIndex}>
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
          <Button onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0}>
            Previous
          </Button>
          {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, sortedPlayers.length)} of ${sortedPlayers.length}`}
          <Button onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(sortedPlayers.length / rowsPerPage) - 1))} disabled={page >= Math.floor(sortedPlayers.length / rowsPerPage)}>
            Next
          </Button>
        </div>
      </div>

    </div>
  );
}