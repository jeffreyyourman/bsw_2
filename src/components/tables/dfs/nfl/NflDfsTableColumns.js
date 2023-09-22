import React from "react";

export function useColumns() {
    const columns = React.useMemo(
        () => [
            {
                Header: "Lock",
                minWidth: 1000,
                accessor: "isLocked",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "Exclude",
                minWidth: 1000,
                accessor: "excludePlayer",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "Id",
                minWidth: 1000,
                accessor: "Id",
                editable: false,
            },
            {
                Header: "Position",
                minWidth: 1000,
                accessor: "Position",
                editable: false,
            },
            {
                Header: "Roster Position",
                minWidth: 1000,
                accessor: "Roster Position",
                editable: false,
            },
            {
                Header: "First_Name",
                minWidth: 1000,
                accessor: "First_Name",
                editable: false,
            },
            {
                Header: "Last_Name",
                minWidth: 1000,
                accessor: "Last_Name",
                editable: false,
            },
            // {
            //     Header: "Name",
            //     minWidth: 1000,
            //     accessor: "Nickname",
            //     editable: false,
            // },

            {
                Header: "Projections",
                minWidth: 1000,
                accessor: "FPPG",
                editable: true,
                Cell: ({ value }) => {
                    // return Number(value).toFixed(2);
                    return Number(value).toFixed(2);
                }
            },

            {
                Header: "Salary",
                minWidth: 1000,
                accessor: "Salary",
                editable: false,
            },
            {
                Header: "Game",
                minWidth: 1000,
                accessor: "Game",
                editable: false,
            },
            // {
            //     Header: "Team",
            //     minWidth: 1000,
            //     accessor: "Team",
            //     editable: false,
            // },
            // {
            //     Header: "Opponent",
            //     minWidth: 1000,
            //     accessor: "Opponent",
            //     editable: false,
            // },
            {
                Header: "minExposure",
                minWidth: 1000,
                accessor: "minExposure",
                editable: true,
            },
            {
                Header: "maxExposure",
                minWidth: 1000,
                accessor: "maxExposure",
                editable: true,
            },

            {
                Header: "StdDev",
                minWidth: 1000,
                accessor: "StdDev",
                editable: true,
            },

            {
                Header: "Ceiling",
                minWidth: 1000,
                accessor: "Ceiling",
                editable: true,
            },
            {
                Header: "Floor",
                minWidth: 1000,
                accessor: "Floor",
                editable: true,
            },
            {
                Header: "BustPct",
                minWidth: 1000,
                accessor: "BustPct",
                editable: true,
            },
            {
                Header: "BoomPct",
                minWidth: 1000,
                accessor: "BoomPct",
                editable: true,
            },

            {
                Header: "Pass yards",
                minWidth: 1000,
                accessor: "pass_yards",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Pass tds",
                minWidth: 1000,
                accessor: "pass_tds",
                editable: true,
                disableFilters: true
            },

            {
                Header: "Pass comp att",
                minWidth: 1000,
                accessor: "pass_comp_att",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Pass interceptions",
                minWidth: 1000,
                accessor: "pass_interceptions",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rush att",
                minWidth: 1000,
                accessor: "rush_att",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rush yds",
                minWidth: 1000,
                accessor: "rush_yds",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rush tds",
                minWidth: 1000,
                accessor: "rush_tds",
                editable: true,
                disableFilters: true
            },

            {
                Header: "Receptions",
                minWidth: 1000,
                accessor: "receptions",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rec tgts",
                minWidth: 1000,
                accessor: "rec_tgts",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rec yds",
                minWidth: 1000,
                accessor: "rec_yds",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rec tds",
                minWidth: 1000,
                accessor: "rec_tds",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Value",
                minWidth: 1000,
                accessor: "fanduel_value",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Injury Indicator",
                minWidth: 1000,
                accessor: "Injury_Indicator",
                editable: false,
            },
            {
                Header: "Injury Details",
                minWidth: 1000,
                accessor: "Injury_Details",
                editable: false,
            },
            // {
            //     Header: "NFLStats Proj",
            //     minWidth: 1000,
            //     accessor: "nfl_pts_proj",
            //     editable: false,
            // },
            // {
            //     Header: "NumberFire Proj",
            //     minWidth: 1000,
            //     accessor: "numberFire_pts_proj",
            //     editable: false,
            // },


            // {
            //   Header: "Projection",
            // minWidth:1000,
            //   accessor: "FPPG",
            //   editable: true,
            // },
            // {
            //   Header: "Played",
            // minWidth:1000,
            //   accessor: "Played",
            //   editable: false,
            // },
            // {
            //   Header: "Tier",
            // minWidth:1000,
            //   accessor: "Tier",
            //   editable: false,
            // },
            // {
            //   Header: "OwnershipPct",
            // minWidth:1000,
            //   accessor: "OwnershipPct",
            //   editable: true,
            // },
            // {
            //   Header: "OptimalPct",
            // minWidth:1000,
            //   accessor: "OptimalPct",
            //   editable: true,
            // },
            // ... your columns
        ],
        []
    );
    return columns
}
export function useExcludeColumns() {
    const columns = React.useMemo(
        () => [

            {
                Header: "Include",
                minWidth: 1000,
                accessor: "includePlayer",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "Id",
                minWidth: 1000,
                accessor: "Id",
                editable: false,
            },
            {
                Header: "Position",
                minWidth: 1000,
                accessor: "Position",
                editable: false,
            },
            {
                Header: "Roster Position",
                minWidth: 1000,
                accessor: "Roster Position",
                editable: false,
            },
            {
                Header: "First_Name",
                minWidth: 1000,
                accessor: "First_Name",
                editable: false,
            },
            {
                Header: "Last_Name",
                minWidth: 1000,
                accessor: "Last_Name",
                editable: false,
            },
            {
                Header: "Name",
                minWidth: 1000,
                accessor: "Nickname",
                editable: false,
            },

            {
                Header: "Projections",
                minWidth: 1000,
                accessor: "FPPG",
                editable: true,
                Cell: ({ value }) => {
                    // return Number(value).toFixed(2);
                    return Number(value).toFixed(2);
                }
            },

            {
                Header: "Injury Indicator",
                minWidth: 1000,
                accessor: "Injury_Indicator",
                editable: false,
            },
            {
                Header: "Injury Details",
                minWidth: 1000,
                accessor: "Injury_Details",
                editable: false,
            },

            {
                Header: "Salary",
                minWidth: 1000,
                accessor: "Salary",
                editable: false,
            },
            {
                Header: "Game",
                minWidth: 1000,
                accessor: "Game",
                editable: false,
            },
            {
                Header: "Team",
                minWidth: 1000,
                accessor: "Team",
                editable: false,
            },
            {
                Header: "Opponent",
                minWidth: 1000,
                accessor: "Opponent",
                editable: false,
            },
            // {
            //     Header: "minExposure",
            //     minWidth:1000,
            //     accessor: "minExposure",
            //     editable: true,
            // },
            // {
            //     Header: "maxExposure",
            //     minWidth:1000,
            //     accessor: "maxExposure",
            //     editable: true,
            // },

            {
                Header: "StdDev",
                minWidth: 1000,
                accessor: "StdDev",
                editable: true,
            },

            {
                Header: "Ceiling",
                minWidth: 1000,
                accessor: "Ceiling",
                editable: true,
            },
            {
                Header: "Floor",
                minWidth: 1000,
                accessor: "Floor",
                editable: true,
            },
            {
                Header: "BustPct",
                minWidth: 1000,
                accessor: "BustPct",
                editable: true,
            },
            {
                Header: "BoomPct",
                minWidth: 1000,
                accessor: "BoomPct",
                editable: true,
            },

            {
                Header: "Pass yards",
                minWidth: 1000,
                accessor: "pass_yards",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Pass tds",
                minWidth: 1000,
                accessor: "pass_tds",
                editable: true,
                disableFilters: true
            },

            {
                Header: "Pass comp att",
                minWidth: 1000,
                accessor: "pass_comp_att",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Pass interceptions",
                minWidth: 1000,
                accessor: "pass_interceptions",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rush att",
                minWidth: 1000,
                accessor: "rush_att",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rush yds",
                minWidth: 1000,
                accessor: "rush_yds",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rush tds",
                minWidth: 1000,
                accessor: "rush_tds",
                editable: true,
                disableFilters: true
            },

            {
                Header: "Receptions",
                minWidth: 1000,
                accessor: "receptions",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rec tgts",
                minWidth: 1000,
                accessor: "rec_tgts",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rec yds",
                minWidth: 1000,
                accessor: "rec_yds",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Rec tds",
                minWidth: 1000,
                accessor: "rec_tds",
                editable: true,
                disableFilters: true
            },
            {
                Header: "Value",
                minWidth: 1000,
                accessor: "fanduel_value",
                editable: true,
                disableFilters: true
            },


        ],
        []
    );
    return columns
}