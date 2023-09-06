import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import github from "../img/github-icon.svg";
import logo from "../img/bsw-text-logo.svg";
// import { middleWareGraph } from "../../src/utils/graphql";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  // const test = async() =>{

  //   const result = await middleWareGraph();
  //   console.log('result',result);
  // }

  // useEffect(() => {
    // test();
  // })
  return (
    <nav
      className="navbar is-transparent"
      role="navigation"
      aria-label="main-navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item" title="Logo">
            <img
              src={"./img/bsw/full_image.png"}
              alt="Kaldi"
              style={{ width: "88px" }}
            />
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
        <ul
          id="navMenu"
          className={` navbar-start has-text-centered navbar-menu ${
            isActive && "is-active"
          }`}
        >
          {/* TODO: inline override of padding is a result of refactoring
                to a ul for accessibilty purposes, would like to see a css
                re-write that makes this unneccesary.
             */}
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/fantasy-sports">
              Fantasy Sports
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/daily-fantasy-sports">
              Daily Fantasy Sports
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/sports-betting">
              Sports Betting
            </Link>
          </li>
          {/* <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/about">
              About
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/blog">
              Talk shows
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/dfs">
              DFS
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/products">
              Products
            </Link>
          </li>
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/blog">
              Blogs
            </Link>
          </li> */}
          <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/contact">
              Contact
            </Link>
          </li>
          {/* <li className="navbar-item" style={{ padding: "0px" }}>
            <Link className="navbar-item" to="/contact/examples">
              Form Examples
            </Link>
          </li> */}
          <li className="navbar-end has-text-centered">
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
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
