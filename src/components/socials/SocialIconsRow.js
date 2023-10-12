import React, { useEffect } from "react";
// import PropTypes from "prop-types";
// import { Link, graphql } from "gatsby";
// import { getImage } from "gatsby-plugin-image";

// import Layout from "../components/layouts/Layout";
// import Features from "../components/Features";
// import BlogRoll from "../components/BlogRoll";
// import FullWidthImage from "../components/FullWidthImage";
// import { Star } from '@mui/icons-material';
// import {
//     Box,
//     Button,
//     Typography,
//     Container,
//     Grid,
//     Paper,


//     TextField,
//     FormHelperText,
//     Card,
//     FormControlLabel,
//     Checkbox,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel
// } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import RedditIcon from '@mui/icons-material/Reddit';
import ChatIcon from '@mui/icons-material/Chat';  // Representing Discord as MUI doesn't have a specific Discord icon
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';


const SocialIconsRow = (props) => {
    return (
        <div style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
        }}>
            <YouTubeIcon
                style={{
                    marginRight: 6,
                }}
                color=""
                fontSize="large" />
            <RedditIcon
                style={{
                    marginRight: 6,
                }}
                color=""
                fontSize="large" />
            <ChatIcon
                style={{
                    marginRight: 6,
                }}
                color=""
                fontSize="large" />
            <TwitterIcon
                style={{
                    marginRight: 6,
                }}
                color=""
                fontSize="large" />
            <InstagramIcon
                style={{
                    marginRight: 6,
                }}
                color=""
                fontSize="large" />
        </div>
    )
}

export default SocialIconsRow;
