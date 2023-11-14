import React, { useState } from "react";
import { Link } from "gatsby";
import logo from "../img/BetSweatWinText.png";
import '@mui/material/styles';
import { useClerk, useAuth } from "@clerk/clerk-react";


const Navbar = () => {
  const clerk = useClerk();
  console.log('clerk?.user?', clerk?.user?.imageUrl)
  const { isSignedIn, sessionId, userId } = useAuth();
  // console.log('isSignedIn', isSignedIn)
  const [isActive, setIsActive] = useState(false);
  // const [anchorEl, setAnchorEl] = useState(null);  // for the dropdown

  // const handleMenuClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };




  return (
    <>
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
        style={{ backgroundColor: '#00203d' }}
      >
        <div className="container" style={{ backgroundColor: '#00203d' }}>
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Logo">
              <img src={logo} alt="BSW" style={{ width: "88px" }} />
            </Link>
            {/* Hamburger menu */}
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
          <ul id="navMenu" className={`navbar-start has-text-centered navbar-menu ${isActive && "is-active"}`}>
            {/*... other navbar items*/}

            {/* Dropdown for DFS */}
            <li className="navbar-item" style={{ padding: "0px" }}>
              <Link className="navbar-item" to="/about">
                About
              </Link>
            </li>
            <li className="navbar-item" style={{ padding: "0px" }}>
              <Link className="navbar-item" to="/blog">
                Blog
              </Link>
            </li>
            <li className="navbar-item" style={{ padding: "0px" }}>
              <Link className="navbar-item" to="/contact">
                Contact
              </Link>
            </li>
            <li className="navbar-item" style={{ padding: "0px" }}>
              <Link className="navbar-item" to="/dfs/sport/nfl">
                NFL
              </Link>
            </li>
            <li className="navbar-item" style={{ padding: "0px" }}>
              <Link className="navbar-item" to="/dfs/sport/nba">
                NBA
              </Link>
            </li>
            {/* <li className="navbar-item" style={{ padding: "0px" }}>
              <div className="navbar-item" style={{ cursor: 'pointer' }} onClick={handleMenuClick}>
                DFS
              </div>

              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/dfs/sport/nba">NBA</Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/dfs/sport/nfl"></Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/dfs/sport/nba"></Link>
                </MenuItem>
              </Menu>
            </li> */}
            {/* <li className="navbar-end has-text-centered" style={{ padding: "0px" }}>
              {!isSignedIn ?
                <button className="sign-up-btn" onClick={() => clerk.openSignUp({})}>
                  Login / Register
                </button> :
                <button className="sign-up-btn" onClick={() => clerk.signOut({})}>
                  Sign out
                </button>
              }
            </li> */}
            <li className="navbar-end has-text-centered" style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',

            }}>
              <div style={{ marginRight: '8px' }}>

                {!isSignedIn ?
                  <button className="sign-up-btn" onClick={() => clerk.openSignIn({})}>
                    Login / Register
                  </button> :
                  <button className="sign-up-btn" onClick={() => clerk.signOut({})}>
                    Sign out
                  </button>
                }
              </div>
              

                <span className="icon">
                  <img src={clerk?.user?.imageUrl} />
                  {/* <img src={'https://yt3.ggpht.com/a/AATXAJwEZHtxb25nQA1ck-oAlBbysOTv42PKdLRInw=s900-c-k-c0xffffffff-no-rj-mo'} alt="Github" /> */}
                </span>
              
            </li>
          </ul>
          {/* <ul id="navMenu" className={` navbar-start has-text-centered navbar-menu ${isActive && "is-active"}`}>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/about">
              About
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/blog">
              Blog
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/contact">
              Contact
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/dfs">
              DFS
            </Link>
          </li>
        </ul> */}
        </div >
      </nav >
      {/* <SignIn /> */}
    </>
  );
};

export default Navbar;

{/* <li className="navbar-item" style={{ padding: "0px" }}>
  <Link className="navbar-item" to="/products">
    Products
  </Link>
</li> */}
{/* <li className="navbar-item" style={{ padding: "0px" }}>
  <Link className="navbar-item" to="/contact/examples">
    Form Examples
  </Link>
</li> */}
{/* <li className="navbar-end has-text-centered">
  <a
    className="navbar-item"
    href="https://github.com/netlify-templates/gatsby-starter-netlify-cms"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="icon">
      <img src={github} alt="Github" />
    </span>
  </a>
</li> */}