import React from "react";

export function NflLineupsColumns() {
    // const getTeamLogo = (abbr) => `/img/teams/nfl/${abbr}.gif`;


     
   
     
    
     
    
     
    
     
    
     
    
     
    
     
    
     
    
     
    
     
    
     
    
     
    
     
    
     
    
     
    
    
    
    const columns = React.useMemo(
        () => [
            {
                Header: "lineup_num",
                minWidth: 1000,
                accessor: "lineup_num",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "lineup_points",
                minWidth: 1000,
                accessor: "lineup_points",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "lineup_salary",
                minWidth: 1000,
                accessor: "lineup_salary",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "players",
                minWidth: 1000,
                accessor: "players",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalEverything",
                minWidth: 1000,
                accessor: "totalEverything",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalPassInterceptions",
                minWidth: 1000,
                accessor: "totalPassInterceptions",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalPassTds",
                minWidth: 1000,
                accessor: "totalPassTds",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalPassYards",
                minWidth: 1000,
                accessor: "totalPassYards",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalRecTds",
                minWidth: 1000,
                accessor: "totalRecTds",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalRecTgts",
                minWidth: 1000,
                accessor: "totalRecTgts",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalRecYds",
                minWidth: 1000,
                accessor: "totalRecYds",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalReceptions",
                minWidth: 1000,
                accessor: "totalReceptions",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalRushAtt",
                minWidth: 1000,
                accessor: "totalRushAtt",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalRushTds",
                minWidth: 1000,
                accessor: "totalRushTds",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalRushYds",
                minWidth: 1000,
                accessor: "totalRushYds",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalTds",
                minWidth: 1000,
                accessor: "totalTds",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            {
                Header: "totalfppg",
                minWidth: 1000,
                accessor: "totalfppg",
                disableFilters: true,
                disableSortBy: true,
                editable: true,
            },
            // {
            //     Header: "Total projected",
            //     minWidth: 1000,
            //     accessor: "lineup_points",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total Tds",
            //     minWidth: 1000,
            //     accessor: "totalTds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total Everything",
            //     minWidth: 1000,
            //     accessor: "totalEverything",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RecTds",
            //     minWidth: 1000,
            //     accessor: "totalRecTds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RecTgts",
            //     minWidth: 1000,
            //     accessor: "totalRecTgts",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RecYds",
            //     minWidth: 1000,
            //     accessor: "totalRecYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total Receptions",
            //     minWidth: 1000,
            //     accessor: "totalReceptions",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushAtt",
            //     minWidth: 1000,
            //     accessor: "totalRushAtt",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushTds",
            //     minWidth: 1000,
            //     accessor: "totalRushTds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Total RushYds",
            //     minWidth: 1000,
            //     accessor: "totalRushYds",
            //     disableFilters: true,
            //     disableSortBy: true,
            //     editable: true,
            // },
            // {
            //     Header: "Projections",
            //     minWidth: 1000,
            //     accessor: "FPPG",
            //     editable: true,
            //     Cell: ({ value }) => {
            //         console.log('value;m value', value)
            //         // return Number(value).toFixed(2);
            //         return Number(value).toFixed(2);
            //     }
            // },
        ],
        []
    );
    return columns
}