import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { CSVLink } from "react-csv";
// import columns from "./NflDfsTableColumns";
import { useColumns } from "./NflDfsTableColumns";
import { NflPlayerList } from '../../../../mockJson/nfl/nflPlayerList'

import axios from "axios";
import { AiFillUnlock, AiFillLock } from "react-icons/fa";
import { FiUnlock, FiLock } from "react-icons/fi";
// import LeftSideDrawer from "./drawers/LeftSideDrawer";
import BottomDrawer from "../../../drawers/BottomDrawer";
import GameMatchups from '../../../../mockJson/nfl/week-2-2023-games-nextgenstats.json'
import GameMatchupsCarousel from '../../../carousels/GameMatchupCarousel'
import NflPlayerPosFilter from "./NflPlayerPosFilters";
import NFLPlayerSearch from "./NflPlayerSearch";

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
    // useFilters,
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
  const columns = useColumns();
  const nflPlayerList = NflPlayerList();
  const [lineups, setLineups] = useState([]);
  const [excludedLineups, setExcludedLineups] = useState([]);
  const [isDescendingOrder, setIsDescendingOrder] = useState(true);
  const [data, setData] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [exportPlayerLines, setExportPlayerLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numLineups, setNumLineups] = useState(5);
  const [site, setSite] = useState("FANDUEL");
  const [sport, setSport] = useState("FOOTBALL");
  const [totalMinExp, setTotalMinExp] = useState(0);
  const [totalMaxExp, setTotalMaxExp] = useState(50);
  const [randomStd, setrandomStd] = useState(15);
  const [position, setPosition] = useState('All');
  // const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    setData(nflPlayerList)
    setFilteredPlayers(nflPlayerList);

  }, [])

  const handleSearchOnChange = (text) => {
    // console.log('e', text)
    if (position !== 'All') setPosition('All')

    let searchTextLowerCase = text.toLowerCase();
    // console.log('searchTextLowerCase', searchTextLowerCase);
    const filterName = data.filter((player) => {
      let newPlayerName = player.Nickname.toLowerCase();
      if (newPlayerName.includes(searchTextLowerCase)) {
        return player;
      }
    });
    console.log('filtername;, fil', filterName)
    if (filterName.length !== 0) {
      setFilteredPlayers(filterName);
    } else {
      setFilteredPlayers(data);
    }
  };

  const filterPlayersByPosition = (position) => {
    console.log('position', position);
    if (position === "All") {
      console.log('all mfer', data)
      setFilteredPlayers(data);
    } else {

      setFilteredPlayers(data.filter(player => player.Position === position));
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

        // // Convert salary to numbers
        // row[7] = parseFloat(parseFloat(row[7]).toFixed(2));
        // row[7] = isNaN(row[7]) ? 0 : row[7];

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


      console.log('formattedData', formattedData);
      setData(formattedData);
    }
    reader.readAsText(file);
  };

  let handleSubmitPlayers = () => {
    setLoading(true)

    let zeroCount = 0;

    const filteredData = data.filter(player => {
      // console.log('player.FPPG', player.FPPG);
      if (player.FPPG < 2) {
        zeroCount++;
        return false;
      }
      return true;
    });

    const transformedPlayers = filteredData.map(player => {
      return {
        FPPG: player.FPPG,
        First_Name: player.First_Name,
        Game: player.Game,
        Id: player.Id,
        Injury_Details: player.Injury_Details,
        Injury_Indicator: player.Injury_Indicator,
        Last_Name: player.Last_Name,
        Nickname: player.Nickname,
        Opponent: player.Opponent,
        Position: player.Position,
        "Roster Position": player["Roster Position"],
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

    console.log('transformedPlayers,', transformedPlayers);


    let myargs = {
      numLineups: parseInt(numLineups, 10),
      site,
      sport,
      totalMinExp,
      totalMaxExp,
      randomStd,
      players: transformedPlayers,
      // maxFromPosition: 3,
      // maxFromPosition: {
      //   // "TE": 1, 
      //   // "WR": 2 //if i don't want wr in TE i would set it to 2 because there are 3 max per lineup and the third would be avoided which is the flex spot
      // },
      // maxFromSameTeam: {
      //   "NYG": 2,
      //   "NYJ": 2,
      // },
      maxFromSameTeam: 3,
      rules: [
        {
          stackType: 'position',
          positions: ['QB', ['WR', 'TE']],
          // positions: [ 'QB' , [ 'WR' , 'TE' ] ]
        },
        // {
        //   stackType: 'restrictOpp',
        //   team1Pos: ['D'],
        //   team2Pos: ['QB', 'WR', 'RB', 'TE']
        // },
        // {
        //   stackType: 'restrictSame',
        //   positions: ['RB', 'QB'] //Don't want qb and rb from same team
        // },
        {
          stackType: 'restrictSame',
          positions: ['TE', 'TE'] //Don't want te and te from same team
        },
        // {
        //   stackType: 'restrictSame',
        //   positions: ['TE', 'WR'] //Don't want te and wr from same team
        // },
      ]
    };
    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Bearer yourTokenHere",
    };

    axios
      .post(
        "https://bsw-be-api.onrender.com/optimizer",
        // "https://anxious-teal-gilet.cyclic.cloud/optimizer",
        // "https://testingoptimizer.azurewebsites.net/api/httptrigger1",
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

          // console.log('totalPassTds', totalPassTds)
          // console.log('totalPassInterceptions', totalPassInterceptions)
          // console.log('totalPassYards', totalPassYards)

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
    let amtOfLinesToExport = amtOfLinesToExport || 350;
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

  return (
    <>
      <input type="file" onChange={handleFileUpload} />
      {data.length > 0 ? (
        <div>
          <GameMatchupsCarousel games={GameMatchups} />
          <NflPlayerPosFilter
            players={data}
            selectedPosition={position}
            filterPlayersByPosition={filterPlayersByPosition}
            onPositionChange={setPosition}

          // onPositionChange={filterPlayersByPosition} 
          />
          <NFLPlayerSearch data={data} onSearch={handleSearchOnChange} />

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
              type="number"
              defaultValue={totalMinExp}
              onChange={(e) => {
                console.log('e.target.value', e.target.value)
                console.log('typeof e.target.value', typeof e.target.value)
                setTotalMinExp(Number(e.target.value));
              }}
              style={{ width: "100px" }}
              min={100}  // Maximum value allowed
              max={totalMaxExp.length}
            />
          </div>
          <div style={{ display: "flex" }}>
            <label>totalMaxExp</label>
            <input
              type="number"
              defaultValue={totalMaxExp}
              onChange={(e) => {
                setTotalMaxExp(Number(e.target.value));
              }}
              style={{ width: "100px" }}
              max={100}  // Maximum value allowed
              min={totalMinExp.length}
            />
          </div>
          <div style={{ display: "flex" }}>
            <label>randomize lines</label>
            <input
              type="number"
              defaultValue={randomStd}
              onChange={(e) => {
                setrandomStd(Number(e.target.value));
              }}
              style={{ width: "100px" }}
            />
          </div>
          <button
            disabled={loading}
            onClick={handleSubmitPlayers}
          >
            Submit
          </button>
          <div style={{ overflow: "auto" }}>
            {/* <Table columns={columns} data={data} setData={setData} /> */}
            <Table columns={columns} data={filteredPlayers} setData={setData} />
            {/* <Table columns={columns} data={position === 'All' ? data : filteredPlayers} setData={setData} /> */}
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
    </>
  );
}
