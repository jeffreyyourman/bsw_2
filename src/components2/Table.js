import React, { useState } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { CSVLink } from "react-csv";
import {
  testPlayerList,
  testPlayerListUpdated,
} from "./mockJson/testPlayerList";
import axios from "axios";
import { AiFillUnlock, AiFillLock } from "react-icons/fa";
import { FiUnlock, FiLock } from "react-icons/fi";
// import LeftSideDrawer from "./drawers/LeftSideDrawer";
import BottomDrawer from "./drawers/BottomDrawer";

const TextFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value)}
    />
  );
};
const Table = ({ columns, data, setData }) => {
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
    useFilters,
    useSortBy,
    usePagination
  );

  // getRowProps: (row) => ({
  //   isLocked: row.original.isLocked,
  //   toggleLocked: () =>
  //     setData((prevData) =>
  //       prevData.map((d) =>
  //         d.name === row.original.name ? { ...d, isLocked: !d.isLocked } : d
  //       )
  //     ),
  //   ...row.getRowProps(),
  // }),

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
  };
  const handleLock = (value, rowIndex, columnId) => {
    // const { value } = e.target;
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
  };

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
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
              <tr {...row.getRowProps()}>
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
                        cell.column.Header === "Lock" ? (
                          <button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                            onClick={(e) => {
                              handleLock(
                                !cell.value,
                                row.index,
                                cell.column.id
                              );
                            }}
                          >
                            {cell.value ? <FiLock style={{ color: 'red' }} /> : <FiUnlock style={{ color: 'green' }} />}
                            {/* {isSubmitted ? "Remove" : "Toggle"} */}
                          </button>
                        ) : (
                          <input
                            type="text"
                            value={cell.value}
                            onChange={(e) => {
                              // const newValue = e.target.value;
                              // row.cells[cell.column.id].value = newValue;
                              handleInputChange(e, row.index, cell.column.id);
                            }}
                          />
                        )
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
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <CSVLink data={data}>Export CSV</CSVLink>
    </>
  );
};

export default function ExampleTable(props) {
  const [data, setData] = useState(testPlayerListUpdated);
  const [numLineups, setNumLineups] = useState(3);
  const [site, setSite] = useState("FANDUEL");
  const [sport, setSport] = useState("BASKETBALL");
  const [totalMinExp, setTotalMinExp] = useState(0);
  const [totalMaxExp, setTotalMaxExp] = useState(100);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      const parsedData = csvData.split("\n").map((row) => {
        return row.split(",");
      });
      const headers = parsedData[0];
      const rows = parsedData.slice(1);
      const formattedData = rows.map((row) => {
        return headers.reduce((acc, header, index) => {
          acc[header] = row[index];
          return acc;
        }, {});
      });
      setData(formattedData);
    };
    reader.readAsText(file);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Lock",
        accessor: "isLocked",
        disableFilters: true,
        disableSortBy: true,
        editable: true,
      },
      {
        Header: "Id",
        accessor: "Id",
        editable: false,
      },
      {
        Header: "Position",
        accessor: "Position",
        editable: false,
      },
      {
        Header: "First_Name",
        accessor: "First_Name",
        editable: false,
      },
      {
        Header: "Full_Name",
        accessor: "Full_Name",
        editable: false,
      },
      {
        Header: "Last_Name",
        accessor: "Last_Name",
        editable: false,
      },
      {
        Header: "FPPG",
        accessor: "FPPG",
        editable: false,
        Cell: ({ value }) => {
          return Number(value).toFixed(2);
        }
      },
      {
        Header: "Played",
        accessor: "Played",
        editable: false,
      },
      {
        Header: "Salary",
        accessor: "Salary",
        editable: false,
      },
      {
        Header: "Game",
        accessor: "Game",
        editable: false,
      },
      {
        Header: "Team",
        accessor: "Team",
        editable: false,
      },
      {
        Header: "Opponent",
        accessor: "Opponent",
        editable: false,
      },
      {
        Header: "projminutes",
        accessor: "projminutes",
        editable: true,
      },
      {
        Header: "minExposure",
        accessor: "minExposure",
        editable: true,
      },
      {
        Header: "maxExposure",
        accessor: "maxExposure",
        editable: true,
      },
      {
        Header: "Projections",
        accessor: "Projections",
        editable: true,
      },
      {
        Header: "Injury_Indicator",
        accessor: "Injury_Indicator",
        editable: false,
      },
      {
        Header: "Injury_Details",
        accessor: "Injury_Details",
        editable: false,
      },
      {
        Header: "Tier",
        accessor: "Tier",
        editable: false,
      },
      {
        Header: "StdDev",
        accessor: "StdDev",
        editable: true,
      },

      {
        Header: "Ceiling",
        accessor: "Ceiling",
        editable: true,
      },
      {
        Header: "Floor",
        accessor: "Floor",
        editable: true,
      },
      {
        Header: "BustPct",
        accessor: "BustPct",
        editable: true,
      },
      {
        Header: "BoomPct",
        accessor: "BoomPct",
        editable: true,
      },
      {
        Header: "OwnershipPct",
        accessor: "OwnershipPct",
        editable: true,
      },
      {
        Header: "OptimalPct",
        accessor: "OptimalPct",
        editable: true,
      },

    ],
    []
  );
  let handleSubmitPlayers = () => {
    let myargs = {
      numLineups: parseInt(numLineups, 10),
      site,
      sport,
      totalMinExp,
      totalMaxExp,
      players: data,
    };
    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Bearer yourTokenHere",
    };

    axios
      .post(
        "https://testingoptimizer.azurewebsites.net/api/httptrigger1",
        { data: myargs },
        // { data: JSON.stringify(myargs) },
        { headers }
      )
      .then((response) => {
        console.log(response.data[0].lineups);
        props.setLineups(response.data[0].lineups);
        props.setLineupsData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <input type="file" onChange={handleFileUpload} />
      {data.length > 0 ? (
        <div>
          <div style={{ display: "flex" }}>
            <label>numLineups</label>
            <input
              type="number"
              defaultValue={numLineups}
              onChange={(e) => {
                setNumLineups(e.target.value);
              }}
              style={{ width: "100px" }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <label>site</label>
            <input
              type="text"
              defaultValue={site}
              onChange={(e) => {
                setSite(e.target.value);
              }}
              style={{ width: "100px" }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <label>sport</label>
            <input
              type="text"
              defaultValue={sport}
              onChange={(e) => {
                setSport(e.target.value);
              }}
              style={{ width: "100px" }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <label>totalMinExp</label>
            <input
              type="text"
              defaultValue={totalMinExp}
              onChange={(e) => {
                setTotalMinExp(e.target.value);
              }}
              style={{ width: "100px" }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <label>totalMaxExp</label>
            <input
              type="text"
              defaultValue={totalMaxExp}
              onChange={(e) => {
                setTotalMaxExp(e.target.value);
              }}
              style={{ width: "100px" }}
            />
          </div>
          <button onClick={handleSubmitPlayers}>Submit</button>
          <div style={{ overflow: "auto" }}>
            <Table columns={columns} data={data} setData={setData} />

            {props.lineups.length !== 0 && (
              <div style={{ marginTop: "64px" }}>
                <p>total lines: {props.lineups.length}</p>
                <BottomDrawer lineups={props.lineups} />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
