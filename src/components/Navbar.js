import React, { useState } from "react";
import { Link } from "gatsby";
import logo from "../img/BetSweatWinText.png";
import '@mui/material/styles';
import { useClerk, useAuth } from "@clerk/clerk-react";
import ProfileModal from '../components/modals/ProfileModal';
import { MenuItem, Menu } from '@mui/material'
const Navbar = () => {
  const clerk = useClerk();
  console.log('clerk?.user?', clerk?.user?.imageUrl)
  const { isSignedIn, sessionId, userId } = useAuth();
  // console.log('isSignedIn', isSignedIn)
  const [isActive, setIsActive] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);  // for the dropdown

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const handleOpenProfileModal = () => {
    setProfileModalOpen(true)
  }
  const handleCloseProfileModal = () => {
    setProfileModalOpen(false)
  }


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




              {/* <li className="navbar-item" style={{ padding: "0px" }}>
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



              {isSignedIn && <span className="icon">
                <ProfileModal open={profileModalOpen} logout={() => clerk.signOut({})} handleClose={handleCloseProfileModal} />

                <img src={clerk?.user?.imageUrl} onClick={handleMenuClick} />

                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <span onClick={handleOpenProfileModal}>Profile</span>
                    {/* <Link to="/dfs/sport/nba">Profile</Link> */}
                  </MenuItem>

                </Menu>

              </span>}
            </li>
          </ul>


        </div >
      </nav >
      {/* <SignIn /> */}
    </>
  );
};

export default Navbar;






  //         {/* <ul id="navMenu" className={` navbar-start has-text-centered navbar-menu ${isActive && "is-active"}`}>
  //         <li className="navbar-item" style={{ padding: "0px" }}>
  //           <Link className="navbar-item" to="/about">
  //             About
  //           </Link>
  //         </li>
  //         <li className="navbar-item" style={{ padding: "0px" }}>
  //           <Link className="navbar-item" to="/blog">
  //             Blog
  //           </Link>
  //         </li>
  //         <li className="navbar-item" style={{ padding: "0px" }}>
  //           <Link className="navbar-item" to="/contact">
  //             Contact
  //           </Link>
  //         </li>
  //         <li className="navbar-item" style={{ padding: "0px" }}>
  //           <Link className="navbar-item" to="/dfs">
  //             DFS
  //           </Link>
  //         </li>
  //       </ul> */}