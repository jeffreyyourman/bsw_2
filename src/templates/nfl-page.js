import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import Layout from "../components/Layout";
// import Features from "../components2/Features";
// import BlogRoll from "../components2/BlogRoll";
import FullWidthImage from "../components/FullWidthImage";
import NFLTable from "../components2/NFLTable";
// import PreviewCompatibleImage from "../components2/PreviewCompatibleImage";
import { useTable } from "react-table";
// import LeftSideDrawer from "../components2/drawers/LeftSideDrawer";
// import BottomDrawer from "../components2/drawers/BottomDrawer";
// eslint-disable-next-line
export const DfsPageTemplate = ({
  image,
  title,
  heading,
  subheading,
  mainpitch,
  description,
  intro,
  main,
}) => {
  const [lineups, setLineups] = useState([]);
  // const [lineups, setLineups] = useState([
  //   {
  //     "lineup_num": 3,
  //     "lineup_salary": 60000,
  //     "lineup_points": 137.107,
  //     "players": [
  //       {
  //         "playerId": "92765-54879",
  //         "playerName": "Deshaun Watson",
  //         "playerSalary": 7400,
  //         "playerProjected": 18.29,
  //         "playerPos": "QB",
  //         "playerTeam": "CLE",
  //         "playerStats": {
  //           "fppg": 18.29,
  //           "fanduel_fp": "18.8",
  //           "fanduel_value": "2.54",
  //           "opp_rank": "#11",
  //           "opp_team": "CIN",
  //           "ovr_rank": "#11",
  //           "pass_comp_att": "18.41/29.04",
  //           "pass_interceptions": "0.53",
  //           "pass_tds": "1.44",
  //           "pass_yards": "224.83",
  //           "pos_rank": "#11",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 7.01,
  //           "rush_tds": 0.25,
  //           "rush_yds": 34.58
  //         }
  //       },
  //       {
  //         "playerId": "92765-136855",
  //         "playerName": "Bijan Robinson",
  //         "playerSalary": 7800,
  //         "playerProjected": 14.82,
  //         "playerPos": "RB",
  //         "playerTeam": "ATL",
  //         "playerStats": {
  //           "fppg": 14.82,
  //           "fanduel_fp": "15.98",
  //           "fanduel_value": "2.05",
  //           "opp_rank": "#18",
  //           "opp_team": "CAR",
  //           "ovr_rank": "#26",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#5",
  //           "rec_att": "2.35",
  //           "rec_tds": 0.13,
  //           "rec_tgts": 3.38,
  //           "rec_yds": 17.28,
  //           "receptions": 2.35,
  //           "rush_att": 18.59,
  //           "rush_tds": 0.63,
  //           "rush_yds": 87.18
  //         }
  //       },
  //       {
  //         "playerId": "92765-55050",
  //         "playerName": "Christian McCaffrey",
  //         "playerSalary": 9200,
  //         "playerProjected": 14.93,
  //         "playerPos": "RB",
  //         "playerTeam": "SF",
  //         "playerStats": {
  //           "fppg": 14.93,
  //           "fanduel_fp": "17.37",
  //           "fanduel_value": "1.89",
  //           "opp_rank": "#20",
  //           "opp_team": "PIT",
  //           "ovr_rank": "#24",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#4",
  //           "rec_att": "4.88",
  //           "rec_tds": 0.3,
  //           "rec_tgts": 6.77,
  //           "rec_yds": 39.25,
  //           "receptions": 4.88,
  //           "rush_att": 13.67,
  //           "rush_tds": 0.49,
  //           "rush_yds": 63
  //         }
  //       },
  //       {
  //         "playerId": "92765-31001",
  //         "playerName": "Amari Cooper",
  //         "playerSalary": 6700,
  //         "playerProjected": 9.11,
  //         "playerPos": "WR",
  //         "playerTeam": "CLE",
  //         "playerStats": {
  //           "fppg": 9.11,
  //           "fanduel_fp": "11.4",
  //           "fanduel_value": "1.7",
  //           "opp_rank": "#11",
  //           "opp_team": "CIN",
  //           "ovr_rank": "#77",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#16",
  //           "rec_att": "4.55",
  //           "rec_tds": 0.47,
  //           "rec_tgts": 7.11,
  //           "rec_yds": 63.08,
  //           "receptions": 4.55,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-60858",
  //         "playerName": "Christian Kirk",
  //         "playerSalary": 6900,
  //         "playerProjected": 9,
  //         "playerPos": "WR",
  //         "playerTeam": "JAC",
  //         "playerStats": {
  //           "fppg": 9,
  //           "fanduel_fp": "11.55",
  //           "fanduel_value": "1.67",
  //           "opp_rank": "#13",
  //           "opp_team": "IND",
  //           "ovr_rank": "#79",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#18",
  //           "rec_att": "5.08",
  //           "rec_tds": 0.4,
  //           "rec_tgts": 7.56,
  //           "rec_yds": 64.08,
  //           "receptions": 5.08,
  //           "rush_att": 0.26,
  //           "rush_tds": 0.01,
  //           "rush_yds": 1.45
  //         }
  //       },
  //       {
  //         "playerId": "92765-32384",
  //         "playerName": "Mike Evans",
  //         "playerSalary": 6500,
  //         "playerProjected": 8.63,
  //         "playerPos": "WR",
  //         "playerTeam": "TB",
  //         "playerStats": {
  //           "fppg": 8.63,
  //           "fanduel_fp": "10.89",
  //           "fanduel_value": "1.68",
  //           "opp_rank": "#24",
  //           "opp_team": "MIN",
  //           "ovr_rank": "#87",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#22",
  //           "rec_att": "4.59",
  //           "rec_tds": 0.38,
  //           "rec_tgts": 8.12,
  //           "rec_yds": 63.17,
  //           "receptions": 4.59,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-47870",
  //         "playerName": "Tyler Higbee",
  //         "playerSalary": 5300,
  //         "playerProjected": 6.2,
  //         "playerPos": "TE",
  //         "playerTeam": "LAR",
  //         "playerStats": {
  //           "fppg": 6.2,
  //           "fanduel_fp": "8.24",
  //           "fanduel_value": "1.55",
  //           "opp_rank": "#25",
  //           "opp_team": "SEA",
  //           "ovr_rank": "#121",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#3",
  //           "rec_att": "4",
  //           "rec_tds": 0.33,
  //           "rec_tgts": 5.66,
  //           "rec_yds": 42.61,
  //           "receptions": 4,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-40687",
  //         "playerName": "James Conner",
  //         "playerSalary": 6700,
  //         "playerProjected": 11.21,
  //         "playerPos": "FLEX",
  //         "playerTeam": "ARI",
  //         "playerStats": {
  //           "fppg": 11.21,
  //           "fanduel_fp": "12.16",
  //           "fanduel_value": "1.81",
  //           "opp_rank": "#5",
  //           "opp_team": "WSH",
  //           "ovr_rank": "#55",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#17",
  //           "rec_att": "1.91",
  //           "rec_tds": 0.06,
  //           "rec_tgts": 2.66,
  //           "rec_yds": 14.57,
  //           "receptions": 1.91,
  //           "rush_att": 16.25,
  //           "rush_tds": 0.46,
  //           "rush_yds": 68.84
  //         }
  //       },
  //       {
  //         "playerId": "92765-12541",
  //         "playerName": "New England Patriots",
  //         "playerSalary": 3500,
  //         "playerProjected": 11.23529412,
  //         "playerPos": "DEF",
  //         "playerTeam": "NE",
  //         "playerStats": {
  //           "fppg": 11.23529412,
  //           "fanduel_fp": "0",
  //           "fanduel_value": "0",
  //           "opp_rank": "0",
  //           "opp_team": "0",
  //           "ovr_rank": "0",
  //           "pass_comp_att": "0",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "0",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       }
  //     ],
  //     "totalfppg": 103.42529412,
  //     "totalRushAtt": 55.78,
  //     "totalRushTds": 1.84,
  //     "totalRushYds": 255.04999999999998,
  //     "totalReceptions": 27.36,
  //     "totalRecYds": 304.04,
  //     "totalRecTgts": 41.25999999999999,
  //     "totalRecTds": 2.07,
  //     "totalTds": 3.91,
  //     "totalEverything": 790.8252941200001
  //   },
  //   {
  //     "lineup_num": 5,
  //     "lineup_salary": 60000,
  //     "lineup_points": 136.715,
  //     "players": [
  //       {
  //         "playerId": "92765-129315",
  //         "playerName": "Anthony Richardson",
  //         "playerSalary": 6700,
  //         "playerProjected": 19.46,
  //         "playerPos": "QB",
  //         "playerTeam": "IND",
  //         "playerStats": {
  //           "fppg": 19.46,
  //           "fanduel_fp": "20.16",
  //           "fanduel_value": "3.01",
  //           "opp_rank": "#17",
  //           "opp_team": "JAC",
  //           "ovr_rank": "#6",
  //           "pass_comp_att": "18.23/28.75",
  //           "pass_interceptions": "0.66",
  //           "pass_tds": "1.37",
  //           "pass_yards": "197.48",
  //           "pos_rank": "#6",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 9.75,
  //           "rush_tds": 0.45,
  //           "rush_yds": 54.24
  //         }
  //       },
  //       {
  //         "playerId": "92765-72776",
  //         "playerName": "Alexander Mattison",
  //         "playerSalary": 7300,
  //         "playerProjected": 12.36,
  //         "playerPos": "RB",
  //         "playerTeam": "MIN",
  //         "playerStats": {
  //           "fppg": 12.36,
  //           "fanduel_fp": "13.43",
  //           "fanduel_value": "1.84",
  //           "opp_rank": "#16",
  //           "opp_team": "TB",
  //           "ovr_rank": "#43",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#10",
  //           "rec_att": "2.08",
  //           "rec_tds": 0.12,
  //           "rec_tgts": 2.82,
  //           "rec_yds": 13.26,
  //           "receptions": 2.08,
  //           "rush_att": 16.23,
  //           "rush_tds": 0.55,
  //           "rush_yds": 71.23
  //         }
  //       },
  //       {
  //         "playerId": "92765-80001",
  //         "playerName": "Austin Ekeler",
  //         "playerSalary": 9000,
  //         "playerProjected": 15.77,
  //         "playerPos": "RB",
  //         "playerTeam": "LAC",
  //         "playerStats": {
  //           "fppg": 15.77,
  //           "fanduel_fp": "18.01",
  //           "fanduel_value": "2",
  //           "opp_rank": "#23",
  //           "opp_team": "MIA",
  //           "ovr_rank": "#18",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#1",
  //           "rec_att": "4.49",
  //           "rec_tds": 0.3,
  //           "rec_tgts": 5.7,
  //           "rec_yds": 37.45,
  //           "receptions": 4.49,
  //           "rush_att": 13.04,
  //           "rush_tds": 0.75,
  //           "rush_yds": 58.96
  //         }
  //       },
  //       {
  //         "playerId": "92765-31001",
  //         "playerName": "Amari Cooper",
  //         "playerSalary": 6700,
  //         "playerProjected": 9.11,
  //         "playerPos": "WR",
  //         "playerTeam": "CLE",
  //         "playerStats": {
  //           "fppg": 9.11,
  //           "fanduel_fp": "11.4",
  //           "fanduel_value": "1.7",
  //           "opp_rank": "#11",
  //           "opp_team": "CIN",
  //           "ovr_rank": "#77",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#16",
  //           "rec_att": "4.55",
  //           "rec_tds": 0.47,
  //           "rec_tgts": 7.11,
  //           "rec_yds": 63.08,
  //           "receptions": 4.55,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-129458",
  //         "playerName": "Jaxon Smith-Njigba",
  //         "playerSalary": 5300,
  //         "playerProjected": 7.05,
  //         "playerPos": "WR",
  //         "playerTeam": "SEA",
  //         "playerStats": {
  //           "fppg": 7.05,
  //           "fanduel_fp": "9.1",
  //           "fanduel_value": "1.72",
  //           "opp_rank": "#14",
  //           "opp_team": "LA",
  //           "ovr_rank": "#107",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#38",
  //           "rec_att": "4.08",
  //           "rec_tds": 0.34,
  //           "rec_tgts": 6.18,
  //           "rec_yds": 50.56,
  //           "receptions": 4.08,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-90573",
  //         "playerName": "Jaylen Waddle",
  //         "playerSalary": 7900,
  //         "playerProjected": 11.46,
  //         "playerPos": "WR",
  //         "playerTeam": "MIA",
  //         "playerStats": {
  //           "fppg": 11.46,
  //           "fanduel_fp": "14.12",
  //           "fanduel_value": "1.79",
  //           "opp_rank": "#19",
  //           "opp_team": "LAC",
  //           "ovr_rank": "#51",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#4",
  //           "rec_att": "5.32",
  //           "rec_tds": 0.49,
  //           "rec_tgts": 8.39,
  //           "rec_yds": 80.56,
  //           "receptions": 5.32,
  //           "rush_att": 0.62,
  //           "rush_tds": 0.03,
  //           "rush_yds": 3.68
  //         }
  //       },
  //       {
  //         "playerId": "92765-71706",
  //         "playerName": "T.J. Hockenson",
  //         "playerSalary": 7200,
  //         "playerProjected": 7.58,
  //         "playerPos": "TE",
  //         "playerTeam": "MIN",
  //         "playerStats": {
  //           "fppg": 7.58,
  //           "fanduel_fp": "10.08",
  //           "fanduel_value": "1.4",
  //           "opp_rank": "#16",
  //           "opp_team": "TB",
  //           "ovr_rank": "#100",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#2",
  //           "rec_att": "5",
  //           "rec_tds": 0.47,
  //           "rec_tgts": 7.57,
  //           "rec_yds": 48.03,
  //           "receptions": 5,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-40687",
  //         "playerName": "James Conner",
  //         "playerSalary": 6700,
  //         "playerProjected": 11.21,
  //         "playerPos": "FLEX",
  //         "playerTeam": "ARI",
  //         "playerStats": {
  //           "fppg": 11.21,
  //           "fanduel_fp": "12.16",
  //           "fanduel_value": "1.81",
  //           "opp_rank": "#5",
  //           "opp_team": "WSH",
  //           "ovr_rank": "#55",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#17",
  //           "rec_att": "1.91",
  //           "rec_tds": 0.06,
  //           "rec_tgts": 2.66,
  //           "rec_yds": 14.57,
  //           "receptions": 1.91,
  //           "rush_att": 16.25,
  //           "rush_tds": 0.46,
  //           "rush_yds": 68.84
  //         }
  //       },
  //       {
  //         "playerId": "92765-12538",
  //         "playerName": "Los Angeles Rams",
  //         "playerSalary": 3200,
  //         "playerProjected": 6.176470588,
  //         "playerPos": "DEF",
  //         "playerTeam": "LAR",
  //         "playerStats": {
  //           "fppg": 6.176470588,
  //           "fanduel_fp": "0",
  //           "fanduel_value": "0",
  //           "opp_rank": "0",
  //           "opp_team": "0",
  //           "ovr_rank": "0",
  //           "pass_comp_att": "0",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "0",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       }
  //     ],
  //     "totalfppg": 100.176470588,
  //     "totalRushAtt": 55.88999999999999,
  //     "totalRushTds": 2.24,
  //     "totalRushYds": 256.95000000000005,
  //     "totalReceptions": 27.430000000000003,
  //     "totalRecYds": 307.51,
  //     "totalRecTgts": 40.42999999999999,
  //     "totalRecTds": 2.25,
  //     "totalTds": 4.49,
  //     "totalEverything": 792.876470588
  //   },
  //   {
  //     "lineup_num": 2,
  //     "lineup_salary": 59900,
  //     "lineup_points": 143.455,
  //     "players": [
  //       {
  //         "playerId": "92765-22015",
  //         "playerName": "Russell Wilson",
  //         "playerSalary": 7300,
  //         "playerProjected": 17.19,
  //         "playerPos": "QB",
  //         "playerTeam": "DEN",
  //         "playerStats": {
  //           "fppg": 17.19,
  //           "fanduel_fp": "17.78",
  //           "fanduel_value": "2.44",
  //           "opp_rank": "#29",
  //           "opp_team": "LV",
  //           "ovr_rank": "#14",
  //           "pass_comp_att": "20.95/32.19",
  //           "pass_interceptions": "0.6",
  //           "pass_tds": "1.66",
  //           "pass_yards": "233.78",
  //           "pos_rank": "#14",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 3.91,
  //           "rush_tds": 0.14,
  //           "rush_yds": 18.3
  //         }
  //       },
  //       {
  //         "playerId": "92765-40687",
  //         "playerName": "James Conner",
  //         "playerSalary": 6700,
  //         "playerProjected": 11.21,
  //         "playerPos": "RB",
  //         "playerTeam": "ARI",
  //         "playerStats": {
  //           "fppg": 11.21,
  //           "fanduel_fp": "12.16",
  //           "fanduel_value": "1.81",
  //           "opp_rank": "#5",
  //           "opp_team": "WSH",
  //           "ovr_rank": "#55",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#17",
  //           "rec_att": "1.91",
  //           "rec_tds": 0.06,
  //           "rec_tgts": 2.66,
  //           "rec_yds": 14.57,
  //           "receptions": 1.91,
  //           "rush_att": 16.25,
  //           "rush_tds": 0.46,
  //           "rush_yds": 68.84
  //         }
  //       },
  //       {
  //         "playerId": "92765-53562",
  //         "playerName": "Nick Chubb",
  //         "playerSalary": 8600,
  //         "playerProjected": 15.54,
  //         "playerPos": "RB",
  //         "playerTeam": "CLE",
  //         "playerStats": {
  //           "fppg": 15.54,
  //           "fanduel_fp": "16.34",
  //           "fanduel_value": "1.9",
  //           "opp_rank": "#11",
  //           "opp_team": "CIN",
  //           "ovr_rank": "#20",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#3",
  //           "rec_att": "1.63",
  //           "rec_tds": 0.07,
  //           "rec_tgts": 2.32,
  //           "rec_yds": 11.47,
  //           "receptions": 1.63,
  //           "rush_att": 20.39,
  //           "rush_tds": 0.72,
  //           "rush_yds": 99.79
  //         }
  //       },
  //       {
  //         "playerId": "92765-57403",
  //         "playerName": "Courtland Sutton",
  //         "playerSalary": 5900,
  //         "playerProjected": 8.34,
  //         "playerPos": "WR",
  //         "playerTeam": "DEN",
  //         "playerStats": {
  //           "fppg": 8.34,
  //           "fanduel_fp": "10.66",
  //           "fanduel_value": "1.81",
  //           "opp_rank": "#29",
  //           "opp_team": "LV",
  //           "ovr_rank": "#89",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#24",
  //           "rec_att": "4.7",
  //           "rec_tds": 0.39,
  //           "rec_tgts": 8.05,
  //           "rec_yds": 60.14,
  //           "receptions": 4.7,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-90573",
  //         "playerName": "Jaylen Waddle",
  //         "playerSalary": 7900,
  //         "playerProjected": 11.46,
  //         "playerPos": "WR",
  //         "playerTeam": "MIA",
  //         "playerStats": {
  //           "fppg": 11.46,
  //           "fanduel_fp": "14.12",
  //           "fanduel_value": "1.79",
  //           "opp_rank": "#19",
  //           "opp_team": "LAC",
  //           "ovr_rank": "#51",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#4",
  //           "rec_att": "5.32",
  //           "rec_tds": 0.49,
  //           "rec_tgts": 8.39,
  //           "rec_yds": 80.56,
  //           "receptions": 5.32,
  //           "rush_att": 0.62,
  //           "rush_tds": 0.03,
  //           "rush_yds": 3.68
  //         }
  //       },
  //       {
  //         "playerId": "92765-53681",
  //         "playerName": "Tyreek Hill",
  //         "playerSalary": 8800,
  //         "playerProjected": 13.4,
  //         "playerPos": "WR",
  //         "playerTeam": "MIA",
  //         "playerStats": {
  //           "fppg": 13.4,
  //           "fanduel_fp": "16.61",
  //           "fanduel_value": "1.89",
  //           "opp_rank": "#19",
  //           "opp_team": "LAC",
  //           "ovr_rank": "#36",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#1",
  //           "rec_att": "6.47",
  //           "rec_tds": 0.64,
  //           "rec_tgts": 9.61,
  //           "rec_yds": 90.31,
  //           "receptions": 6.47,
  //           "rush_att": 0.62,
  //           "rush_tds": 0.03,
  //           "rush_yds": 3.8
  //         }
  //       },
  //       {
  //         "playerId": "92765-47870",
  //         "playerName": "Tyler Higbee",
  //         "playerSalary": 5300,
  //         "playerProjected": 6.2,
  //         "playerPos": "TE",
  //         "playerTeam": "LAR",
  //         "playerStats": {
  //           "fppg": 6.2,
  //           "fanduel_fp": "8.24",
  //           "fanduel_value": "1.55",
  //           "opp_rank": "#25",
  //           "opp_team": "SEA",
  //           "ovr_rank": "#121",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#3",
  //           "rec_att": "4",
  //           "rec_tds": 0.33,
  //           "rec_tgts": 5.66,
  //           "rec_yds": 42.61,
  //           "receptions": 4,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-28744",
  //         "playerName": "Raheem Mostert",
  //         "playerSalary": 5900,
  //         "playerProjected": 10.04,
  //         "playerPos": "FLEX",
  //         "playerTeam": "MIA",
  //         "playerStats": {
  //           "fppg": 10.04,
  //           "fanduel_fp": "11.04",
  //           "fanduel_value": "1.87",
  //           "opp_rank": "#19",
  //           "opp_team": "LAC",
  //           "ovr_rank": "#66",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#25",
  //           "rec_att": "1.95",
  //           "rec_tds": 0.1,
  //           "rec_tgts": 2.62,
  //           "rec_yds": 13.98,
  //           "receptions": 1.95,
  //           "rush_att": 11.94,
  //           "rush_tds": 0.39,
  //           "rush_yds": 57.91
  //         }
  //       },
  //       {
  //         "playerId": "92765-12541",
  //         "playerName": "New England Patriots",
  //         "playerSalary": 3500,
  //         "playerProjected": 11.23529412,
  //         "playerPos": "DEF",
  //         "playerTeam": "NE",
  //         "playerStats": {
  //           "fppg": 11.23529412,
  //           "fanduel_fp": "0",
  //           "fanduel_value": "0",
  //           "opp_rank": "0",
  //           "opp_team": "0",
  //           "ovr_rank": "0",
  //           "pass_comp_att": "0",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "0",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       }
  //     ],
  //     "totalfppg": 104.61529412,
  //     "totalRushAtt": 53.72999999999999,
  //     "totalRushTds": 1.77,
  //     "totalRushYds": 252.32000000000002,
  //     "totalReceptions": 25.98,
  //     "totalRecYds": 313.64000000000004,
  //     "totalRecTgts": 39.309999999999995,
  //     "totalRecTds": 2.08,
  //     "totalTds": 3.85,
  //     "totalEverything": 793.4452941200001
  //   },
  //   {
  //     "lineup_num": 1,
  //     "lineup_salary": 60000,
  //     "lineup_points": 144.659,
  //     "players": [
  //       {
  //         "playerId": "92765-129315",
  //         "playerName": "Anthony Richardson",
  //         "playerSalary": 6700,
  //         "playerProjected": 19.46,
  //         "playerPos": "QB",
  //         "playerTeam": "IND",
  //         "playerStats": {
  //           "fppg": 19.46,
  //           "fanduel_fp": "20.16",
  //           "fanduel_value": "3.01",
  //           "opp_rank": "#17",
  //           "opp_team": "JAC",
  //           "ovr_rank": "#6",
  //           "pass_comp_att": "18.23/28.75",
  //           "pass_interceptions": "0.66",
  //           "pass_tds": "1.37",
  //           "pass_yards": "197.48",
  //           "pos_rank": "#6",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 9.75,
  //           "rush_tds": 0.45,
  //           "rush_yds": 54.24
  //         }
  //       },
  //       {
  //         "playerId": "92765-80001",
  //         "playerName": "Austin Ekeler",
  //         "playerSalary": 9000,
  //         "playerProjected": 15.77,
  //         "playerPos": "RB",
  //         "playerTeam": "LAC",
  //         "playerStats": {
  //           "fppg": 15.77,
  //           "fanduel_fp": "18.01",
  //           "fanduel_value": "2",
  //           "opp_rank": "#23",
  //           "opp_team": "MIA",
  //           "ovr_rank": "#18",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#1",
  //           "rec_att": "4.49",
  //           "rec_tds": 0.3,
  //           "rec_tgts": 5.7,
  //           "rec_yds": 37.45,
  //           "receptions": 4.49,
  //           "rush_att": 13.04,
  //           "rush_tds": 0.75,
  //           "rush_yds": 58.96
  //         }
  //       },
  //       {
  //         "playerId": "92765-136855",
  //         "playerName": "Bijan Robinson",
  //         "playerSalary": 7800,
  //         "playerProjected": 14.82,
  //         "playerPos": "RB",
  //         "playerTeam": "ATL",
  //         "playerStats": {
  //           "fppg": 14.82,
  //           "fanduel_fp": "15.98",
  //           "fanduel_value": "2.05",
  //           "opp_rank": "#18",
  //           "opp_team": "CAR",
  //           "ovr_rank": "#26",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#5",
  //           "rec_att": "2.35",
  //           "rec_tds": 0.13,
  //           "rec_tgts": 3.38,
  //           "rec_yds": 17.28,
  //           "receptions": 2.35,
  //           "rush_att": 18.59,
  //           "rush_tds": 0.63,
  //           "rush_yds": 87.18
  //         }
  //       },
  //       {
  //         "playerId": "92765-69213",
  //         "playerName": "Michael Pittman Jr.",
  //         "playerSalary": 6600,
  //         "playerProjected": 7.95,
  //         "playerPos": "WR",
  //         "playerTeam": "IND",
  //         "playerStats": {
  //           "fppg": 7.95,
  //           "fanduel_fp": "10.47",
  //           "fanduel_value": "1.59",
  //           "opp_rank": "#17",
  //           "opp_team": "JAC",
  //           "ovr_rank": "#93",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#27",
  //           "rec_att": "5.02",
  //           "rec_tds": 0.37,
  //           "rec_tgts": 7.91,
  //           "rec_yds": 57.96,
  //           "receptions": 5.02,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-89981",
  //         "playerName": "Tee Higgins",
  //         "playerSalary": 7400,
  //         "playerProjected": 9.63,
  //         "playerPos": "WR",
  //         "playerTeam": "CIN",
  //         "playerStats": {
  //           "fppg": 9.63,
  //           "fanduel_fp": "12.34",
  //           "fanduel_value": "1.67",
  //           "opp_rank": "#22",
  //           "opp_team": "CLE",
  //           "ovr_rank": "#72",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#14",
  //           "rec_att": "5.47",
  //           "rec_tds": 0.46,
  //           "rec_tgts": 8.7,
  //           "rec_yds": 68.88,
  //           "receptions": 5.47,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-27050",
  //         "playerName": "Tyler Lockett",
  //         "playerSalary": 6800,
  //         "playerProjected": 9.23,
  //         "playerPos": "WR",
  //         "playerTeam": "SEA",
  //         "playerStats": {
  //           "fppg": 9.23,
  //           "fanduel_fp": "11.99",
  //           "fanduel_value": "1.76",
  //           "opp_rank": "#14",
  //           "opp_team": "LA",
  //           "ovr_rank": "#75",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#15",
  //           "rec_att": "5.56",
  //           "rec_tds": 0.5,
  //           "rec_tgts": 8.07,
  //           "rec_yds": 62.89,
  //           "receptions": 5.56,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-47870",
  //         "playerName": "Tyler Higbee",
  //         "playerSalary": 5300,
  //         "playerProjected": 6.2,
  //         "playerPos": "TE",
  //         "playerTeam": "LAR",
  //         "playerStats": {
  //           "fppg": 6.2,
  //           "fanduel_fp": "8.24",
  //           "fanduel_value": "1.55",
  //           "opp_rank": "#25",
  //           "opp_team": "SEA",
  //           "ovr_rank": "#121",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#3",
  //           "rec_att": "4",
  //           "rec_tds": 0.33,
  //           "rec_tgts": 5.66,
  //           "rec_yds": 42.61,
  //           "receptions": 4,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-103342",
  //         "playerName": "Kenneth Walker III",
  //         "playerSalary": 7100,
  //         "playerProjected": 12.49,
  //         "playerPos": "FLEX",
  //         "playerTeam": "SEA",
  //         "playerStats": {
  //           "fppg": 12.49,
  //           "fanduel_fp": "12.99",
  //           "fanduel_value": "1.83",
  //           "opp_rank": "#14",
  //           "opp_team": "LA",
  //           "ovr_rank": "#42",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#9",
  //           "rec_att": "1.06",
  //           "rec_tds": 0.05,
  //           "rec_tgts": 1.37,
  //           "rec_yds": 7.7,
  //           "receptions": 1.06,
  //           "rush_att": 16.62,
  //           "rush_tds": 0.64,
  //           "rush_yds": 75.66
  //         }
  //       },
  //       {
  //         "playerId": "92765-12539",
  //         "playerName": "Miami Dolphins",
  //         "playerSalary": 3300,
  //         "playerProjected": 6.777777778,
  //         "playerPos": "DEF",
  //         "playerTeam": "MIA",
  //         "playerStats": {
  //           "fppg": 6.777777778,
  //           "fanduel_fp": "0",
  //           "fanduel_value": "0",
  //           "opp_rank": "0",
  //           "opp_team": "0",
  //           "ovr_rank": "0",
  //           "pass_comp_att": "0",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "0",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       }
  //     ],
  //     "totalfppg": 102.32777777800001,
  //     "totalRushAtt": 58,
  //     "totalRushTds": 2.47,
  //     "totalRushYds": 276.03999999999996,
  //     "totalReceptions": 27.949999999999996,
  //     "totalRecYds": 294.77,
  //     "totalRecTgts": 40.79,
  //     "totalRecTds": 2.1399999999999997,
  //     "totalTds": 4.609999999999999,
  //     "totalEverything": 804.4877777779999
  //   },
  //   {
  //     "lineup_num": 4,
  //     "lineup_salary": 60000,
  //     "lineup_points": 141.254,
  //     "players": [
  //       {
  //         "playerId": "92765-129315",
  //         "playerName": "Anthony Richardson",
  //         "playerSalary": 6700,
  //         "playerProjected": 19.46,
  //         "playerPos": "QB",
  //         "playerTeam": "IND",
  //         "playerStats": {
  //           "fppg": 19.46,
  //           "fanduel_fp": "20.16",
  //           "fanduel_value": "3.01",
  //           "opp_rank": "#17",
  //           "opp_team": "JAC",
  //           "ovr_rank": "#6",
  //           "pass_comp_att": "18.23/28.75",
  //           "pass_interceptions": "0.66",
  //           "pass_tds": "1.37",
  //           "pass_yards": "197.48",
  //           "pos_rank": "#6",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 9.75,
  //           "rush_tds": 0.45,
  //           "rush_yds": 54.24
  //         }
  //       },
  //       {
  //         "playerId": "92765-40442",
  //         "playerName": "Aaron Jones",
  //         "playerSalary": 7200,
  //         "playerProjected": 11.37,
  //         "playerPos": "RB",
  //         "playerTeam": "GB",
  //         "playerStats": {
  //           "fppg": 11.37,
  //           "fanduel_fp": "12.61",
  //           "fanduel_value": "1.75",
  //           "opp_rank": "#27",
  //           "opp_team": "CHI",
  //           "ovr_rank": "#53",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#16",
  //           "rec_att": "2.54",
  //           "rec_tds": 0.1,
  //           "rec_tgts": 3.42,
  //           "rec_yds": 17.68,
  //           "receptions": 2.54,
  //           "rush_att": 13.02,
  //           "rush_tds": 0.43,
  //           "rush_yds": 66.89
  //         }
  //       },
  //       {
  //         "playerId": "92765-52442",
  //         "playerName": "Joe Mixon",
  //         "playerSalary": 7500,
  //         "playerProjected": 11.99,
  //         "playerPos": "RB",
  //         "playerTeam": "CIN",
  //         "playerStats": {
  //           "fppg": 11.99,
  //           "fanduel_fp": "13.19",
  //           "fanduel_value": "1.76",
  //           "opp_rank": "#22",
  //           "opp_team": "CLE",
  //           "ovr_rank": "#45",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#12",
  //           "rec_att": "2.41",
  //           "rec_tds": 0.12,
  //           "rec_tgts": 3.21,
  //           "rec_yds": 16.08,
  //           "receptions": 2.41,
  //           "rush_att": 14.73,
  //           "rush_tds": 0.53,
  //           "rush_yds": 64.8
  //         }
  //       },
  //       {
  //         "playerId": "92765-85701",
  //         "playerName": "Ja'Marr Chase",
  //         "playerSalary": 8500,
  //         "playerProjected": 12.78,
  //         "playerPos": "WR",
  //         "playerTeam": "CIN",
  //         "playerStats": {
  //           "fppg": 12.78,
  //           "fanduel_fp": "16.15",
  //           "fanduel_value": "1.9",
  //           "opp_rank": "#22",
  //           "opp_team": "CLE",
  //           "ovr_rank": "#40",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#3",
  //           "rec_att": "6.82",
  //           "rec_tds": 0.64,
  //           "rec_tgts": 10.59,
  //           "rec_yds": 88.43,
  //           "receptions": 6.82,
  //           "rush_att": 0.24,
  //           "rush_tds": 0.01,
  //           "rush_yds": 1.4
  //         }
  //       },
  //       {
  //         "playerId": "92765-90573",
  //         "playerName": "Jaylen Waddle",
  //         "playerSalary": 7900,
  //         "playerProjected": 11.46,
  //         "playerPos": "WR",
  //         "playerTeam": "MIA",
  //         "playerStats": {
  //           "fppg": 11.46,
  //           "fanduel_fp": "14.12",
  //           "fanduel_value": "1.79",
  //           "opp_rank": "#19",
  //           "opp_team": "LAC",
  //           "ovr_rank": "#51",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#4",
  //           "rec_att": "5.32",
  //           "rec_tds": 0.49,
  //           "rec_tgts": 8.39,
  //           "rec_yds": 80.56,
  //           "receptions": 5.32,
  //           "rush_att": 0.62,
  //           "rush_tds": 0.03,
  //           "rush_yds": 3.68
  //         }
  //       },
  //       {
  //         "playerId": "92765-32384",
  //         "playerName": "Mike Evans",
  //         "playerSalary": 6500,
  //         "playerProjected": 8.63,
  //         "playerPos": "WR",
  //         "playerTeam": "TB",
  //         "playerStats": {
  //           "fppg": 8.63,
  //           "fanduel_fp": "10.89",
  //           "fanduel_value": "1.68",
  //           "opp_rank": "#24",
  //           "opp_team": "MIN",
  //           "ovr_rank": "#87",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#22",
  //           "rec_att": "4.59",
  //           "rec_tds": 0.38,
  //           "rec_tgts": 8.12,
  //           "rec_yds": 63.17,
  //           "receptions": 4.59,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-41872",
  //         "playerName": "Evan Engram",
  //         "playerSalary": 5800,
  //         "playerProjected": 5.92,
  //         "playerPos": "TE",
  //         "playerTeam": "JAC",
  //         "playerStats": {
  //           "fppg": 5.92,
  //           "fanduel_fp": "7.78",
  //           "fanduel_value": "1.34",
  //           "opp_rank": "#13",
  //           "opp_team": "IND",
  //           "ovr_rank": "#128",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#4",
  //           "rec_att": "3.78",
  //           "rec_tds": 0.3,
  //           "rec_tgts": 5.58,
  //           "rec_yds": 41.28,
  //           "receptions": 3.78,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       },
  //       {
  //         "playerId": "92765-137902",
  //         "playerName": "Rachaad White",
  //         "playerSalary": 6400,
  //         "playerProjected": 11.02,
  //         "playerPos": "FLEX",
  //         "playerTeam": "TB",
  //         "playerStats": {
  //           "fppg": 11.02,
  //           "fanduel_fp": "12.33",
  //           "fanduel_value": "1.93",
  //           "opp_rank": "#24",
  //           "opp_team": "MIN",
  //           "ovr_rank": "#56",
  //           "pass_comp_att": "0.00/0.00",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "#18",
  //           "rec_att": "2.66",
  //           "rec_tds": 0.11,
  //           "rec_tgts": 3.63,
  //           "rec_yds": 17.83,
  //           "receptions": 2.66,
  //           "rush_att": 14.97,
  //           "rush_tds": 0.42,
  //           "rush_yds": 63.34
  //         }
  //       },
  //       {
  //         "playerId": "92765-12541",
  //         "playerName": "New England Patriots",
  //         "playerSalary": 3500,
  //         "playerProjected": 11.23529412,
  //         "playerPos": "DEF",
  //         "playerTeam": "NE",
  //         "playerStats": {
  //           "fppg": 11.23529412,
  //           "fanduel_fp": "0",
  //           "fanduel_value": "0",
  //           "opp_rank": "0",
  //           "opp_team": "0",
  //           "ovr_rank": "0",
  //           "pass_comp_att": "0",
  //           "pass_interceptions": "0",
  //           "pass_tds": "0",
  //           "pass_yards": "0",
  //           "pos_rank": "0",
  //           "rec_att": "0",
  //           "rec_tds": 0,
  //           "rec_tgts": 0,
  //           "rec_yds": 0,
  //           "receptions": 0,
  //           "rush_att": 0,
  //           "rush_tds": 0,
  //           "rush_yds": 0
  //         }
  //       }
  //     ],
  //     "totalfppg": 103.86529412,
  //     "totalRushAtt": 53.33,
  //     "totalRushTds": 1.87,
  //     "totalRushYds": 254.35000000000002,
  //     "totalReceptions": 28.12,
  //     "totalRecYds": 325.03000000000003,
  //     "totalRecTgts": 42.94,
  //     "totalRecTds": 2.1399999999999997,
  //     "totalTds": 4.01,
  //     "totalEverything": 811.6452941200001
  //   }
  // ]);
  const heroImage = getImage(image) || image;
  console.log({
    image,
    title,
    heading,
    subheading,
    mainpitch,
    description,
    intro,
    main,
  });

  console.log("lineups", lineups);
  return (
    <div>
      <FullWidthImage img={heroImage} title={title} subheading={subheading} />
      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-12">
                <h3 className="has-text-weight-semibold is-size-2">
                  {heading}
                </h3>
                <p>{description}</p>

                <NFLTable lineups={lineups} setLineups={setLineups} />
                <div></div>
              </div>
              {/* <div className="column is-10 is-offset-1">
                <div className="content">
                  <div className="columns">
                    <div className="column is-12">
                      <h3 className="has-text-weight-semibold is-size-2">
                        {heading}
                      </h3>
                      <p>{description}</p>
                      
                      <NFLTable />
                    </div>
                  </div> 
                </div>
              </div>*/}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

DfsPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  description: PropTypes.string,
};

const DFsPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <Layout>
      {/* <LeftSideDrawer /> */}

      <DfsPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        description={frontmatter.description}
      />
    </Layout>
  );
};

DFsPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default DFsPage;

export const pageQuery = graphql`
  query DfsPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "nfl-page" } }) {
      frontmatter {
        title
        image {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        heading
        subheading
        description
      }
    }
  }
`;
