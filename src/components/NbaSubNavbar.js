import React, { useState } from "react";
import { Link } from "gatsby";
import '@mui/material/styles';

const NbaSubNavbar = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <nav
      className="navbar is-transparent"
      role="navigation"
      aria-label="main-navigation"
      style={{ backgroundColor: '#00203d' }}
    >
      <div className="container" style={{ backgroundColor: '#00203d' }}>
        <div className="navbar-brand">
          <button
            className={`navbar-burger burger ${isActive && "is-active"}`}
            aria-expanded={isActive}
            onClick={() => setIsActive(!isActive)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <ul id="navMenu" style={{ marginLeft: '50px' }} className={`navbar-start has-text-centered navbar-menu ${isActive && "is-active"}`}>
          {/*... other navbar items*/}

          {/* Dropdown for DFS */}
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/dfs/sport/nba">
              Lineup Optimizer
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/dfs/sport/nba/projections">
              Projections
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/dfs/sport/nba/matchups">
              Matchups
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/dfs/sport/nba/odds">
              Odds
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/dfs/sport/nba/injuries">
              Injuries
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/dfs/sport/nba/standings">
              Standings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NbaSubNavbar;
