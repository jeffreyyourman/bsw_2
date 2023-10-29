import React, { useState } from "react";
import { Link } from "gatsby";
import '@mui/material/styles';

const NflSubNavbar = () => {
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
        <h1
          style={{
            color: 'white',
            fontSize: '32px',
            display: 'flex',
            alignItems: 'center',
          }}
        >NFL</h1>
        <ul id="navMenu" style={{ marginLeft: '50px' }} className={`navbar-start has-text-centered navbar-menu ${isActive && "is-active"}`}>
          {/*... other navbar items*/}

          {/* Dropdown for DFS */}
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link
              activeClassName="active-link"
              className="navbar-item"
              to="/dfs/sport/nfl">
              Lineup Optimizer
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link
              activeClassName="active-link"
              className="navbar-item"
              to="/dfs/sport/nba/mylineups">
              My saved lineups
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link
              activeClassName="active-link"
              className="navbar-item"
              to="/dfs/sport/nfl/projections">
              Projections
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link
              activeClassName="active-link"
              className="navbar-item"
              to="/dfs/sport/nfl/matchups">
              Matchups
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link
              activeClassName="active-link"
              className="navbar-item"
              to="/dfs/sport/nfl/odds">
              Odds
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link
              activeClassName="active-link"
              className="navbar-item"
              to="/dfs/sport/nfl/injuries">
              Injuries
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link
              activeClassName="active-link"
              className="navbar-item"
              to="/dfs/sport/nfl/standings">
              Standings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NflSubNavbar;
