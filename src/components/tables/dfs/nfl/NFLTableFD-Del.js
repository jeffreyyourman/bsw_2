import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { CSVLink } from "react-csv";
import { useColumns, useExcludeColumns } from "./NflDfsTableColumns";
// import { NflPlayerList } from '../../../../mockJson/nfl/nflPlayerList'
import axios from "axios";
import { FiUnlock, FiLock } from "react-icons/fi";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import { TextField, FormHelperText, Card, FormControlLabel, Checkbox, Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { createTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';

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

export default function NFLTableFD({ columns, data, setData, filteredPlayers, setFilteredPlayers, excludePlayerLines, setExcludePlayerLines }) {
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
    console.log('e', e);
    const { value } = e.target;
    const column = columns.find((col) => col.accessor === columnId);
    if (!column.editable) {
      return;
    }
    setData((prevData) =>
      prevData.map((row, index) => {
        console.log('row', row);
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

