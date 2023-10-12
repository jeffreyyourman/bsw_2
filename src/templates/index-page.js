import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import Layout from "../components/layouts/Layout";
import Features from "../components/Features";
import BlogRoll from "../components/BlogRoll";
import FullWidthImage from "../components/FullWidthImage_split";
import { Star } from '@mui/icons-material';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Paper,


  TextField,
  FormHelperText,
  Card,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import RedditIcon from '@mui/icons-material/Reddit';
import ChatIcon from '@mui/icons-material/Chat';  // Representing Discord as MUI doesn't have a specific Discord icon
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import SocialIconsRow from "../components/socials/SocialIconsRow";

const TextImageRowSection = (props) => {
  return (
    <div style={{
      backgroundColor: props.sectionBgColor
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: props.textDirection,
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        padding: '64px 0px',
      }}>

        {/* left side */}
        <div
          style={{
            width: 500,
          }}
        >
          <h1 style={{
            fontSize: 32,
          }}>
            {props.sectionTitle}
          </h1>
          <p style={{
            marginTop: 16,
            fontSize: 20,
          }}>
            {props.sectionDescription}
          </p>
          <div style={{
            marginTop: 32,
          }}>
            {props.actionWrapper}
          </div>
        </div>

        {/* right side */}
        <div>
          <img src="https://picsum.photos/600/300" alt="Graph" style={{ width: '100%', borderRadius: 4 }} />
        </div>

      </div>
    </div >
  )
}
const TextImageRow = (props) => {
  return (
    <div style={{
      backgroundColor: props.sectionBgColor
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: props.textDirection,
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        padding: 25,
      }}>

        {/* left side */}
        <div
          style={{
            width: 500,
          }}
        >
          <h1 style={{
            fontSize: 32,
          }}>
            {props.sectionTitle}
          </h1>
          <p style={{
            marginTop: 16,
            fontSize: 20,
          }}>
            {props.sectionDescription}
          </p>
          <div style={{
            marginTop: 32,
          }}>
            {props.actionWrapper}
          </div>
        </div>

        {/* right side */}
        <div>
          <img src="https://picsum.photos/600/300" alt="Graph" style={{ width: '100%', borderRadius: 4 }} />
        </div>

      </div>
    </div >
  )
}


// eslint-disable-next-line
const HeaderComponent = (props) => {
  // title, headerDescription, sectionAction , textDirection, sectionBgColor, sectionalHeader
  return (
    <div style={{
      backgroundColor: props.sectionBgColor,
      padding: '64px 0',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: props.textDirection,
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
      }}>
        {/* left side */}
        <div
          style={{
            width: 500
          }}
        >
          <h1 style={{
            // marginTop: 32,
            fontSize: 32,
          }}>
            Win More Bets
          </h1>
          <h2 style={{
            marginTop: 16,
            fontSize: 24,
          }}>
            Go h2remium to access our most exclusive tools. As low as $9.99/month!
          </h2>
          {/* <Typography variant="h3" color="secondary">Win More Bets</Typography> */}
          <div style={{
            marginTop: 32,
          }}>
            <Button variant="contained" color="primary" style={{ marginRight: 8 }}>Upgrade Now</Button>
            <Button variant="contained" color="secondary">Upgrade For Free!</Button>
            <SocialIconsRow />
          </div>
        </div>
        {/* right side */}
        <div>
          <img src="https://picsum.photos/600/300" alt="Graph" style={{ width: '100%', borderRadius: 4 }} />
        </div>

      </div>
    </div >
  )
}

const ServiceSection = (props) => {
  // title, headerDescription, sectionAction , textDirection, sectionBgColor, sectionalHeader
  return (
    <div style={{
      backgroundColor: props.sectionBgColor
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 25,
      }}
      >
        <h1 style={{
          textAlign: 'center',
          fontSize: 32,
        }}>Our Services</h1>
        <p style={{
          maxWidth: 750,
          textAlign: 'center',
          marginTop: 16,
          fontSize: 24,
        }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna a</p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: props.textDirection,
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        marginTop: 16,
      }}>
        {/* left side */}
        <div
          style={{
            width: 500,
          }}
        >
          <h1 style={{
            // marginTop: 32,
            fontSize: 32,
          }}>
            Win More Bets
          </h1>
          <p style={{
            marginTop: 16,
            fontSize: 20,
          }}>
            Go h2remium to access our most exclusive tools. As low as $9.99/month!
          </p>
          {/* <Typography variant="h3" color="secondary">Win More Bets</Typography> */}
          <div style={{
            marginTop: 32,
          }}>
            <Button variant="contained" color="primary" style={{ marginRight: 8 }}>Upgrade Now</Button>
            <Button variant="contained" color="secondary">Upgrade For Free!</Button>
          </div>
        </div>
        {/* right side */}
        <div>
          <img src="https://picsum.photos/600/300" alt="Graph" style={{ width: '100%', borderRadius: 4 }} />
        </div>

      </div>

      <TextImageRow
        // sectionBgColor={}
        textDirection={'row'}
        sectionTitle={'Service 1'}
        sectionDescription={'Service 1 Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1Service 1'}
      // actionWrapper={ }
      />
      <TextImageRow
        // sectionBgColor={}
        textDirection={'row-reverse'}
        sectionTitle={'Service 2'}
        sectionDescription={'Service 2 Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2'}
      // actionWrapper={ }
      />

      <TextImageRow
        // sectionBgColor={}
        textDirection={'row'}
        sectionTitle={'Service 3'}
        sectionDescription={'Service 3 Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3Service 3'}
      // actionWrapper={ }
      />

    </div >
  )
}
export const IndexPageTemplate = ({
  image,
  title,
  heading,
  subheading,
  mainpitch,
  description,
  intro,
}) => {
  const heroImage = getImage(image) || image;
  // useEffect(() => {
  //  window.location.href='/about' 
  // },[])
  return (
    <>
      <HeaderComponent
        textDirection={'row'}
        sectionBgColor={'#99e6ff'}
      />
      <TextImageRowSection
        sectionBgColor={'#eff3fc'}
        textDirection={'row-reverse'}
        sectionTitle={'About BetSweatWin Analytics'}
        sectionDescription={'Service 2 Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2'}
      // actionWrapper={ }
      />

      <FullWidthImage img={heroImage} />

      <ServiceSection
        textDirection={'row-reverse'}
        sectionBgColor={'#99e6ff'}
      />

      <FullWidthImage img={heroImage} />

      <TextImageRowSection
        sectionBgColor={'#eff3fc'}
        textDirection={'row'}
        sectionTitle={'About BetSweatWin Analytics'}
        sectionDescription={'Service 2 Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2Service 2'}
      // actionWrapper={ }
      />

    </>
  );
};

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  mainpitch: PropTypes.object,
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array,
  }),
};

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;
  console.log('frontmatter', frontmatter);
  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        mainpitch={frontmatter.mainpitch}
        description={frontmatter.description}
        intro={frontmatter.intro}
      />
    </Layout>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
        image {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        heading
        subheading
        mainpitch {
          title
          description
        }
        description
        title2
        image2 {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        heading2
        subheading2
        intro {
          blurbs {
            image {
              childImageSharp {
                gatsbyImageData(width: 240, quality: 64, layout: CONSTRAINED)
              }
            }
            text
            servicesHeader
          }
          heading
          description
        }
      }
    }
  }
`;


// <div>
//       <FullWidthImage img={heroImage} title={title} subheading={subheading} />
//       <section className="section section--gradient">
//         <div className="container">
//           <div className="section">
//             <div className="columns">
//               <div className="column is-10 is-offset-1">
//                 <div className="content">
//                   <div className="content">
//                     <div className="tile">
//                       <h1 className="title">{mainpitch.title}</h1>
//                     </div>
//                     <div className="tile">
//                       <div
//                         style={{
//                           display: 'flex',
//                           flexDirection: 'row',
//                           justifyContent: 'space-evenly',
//                           flexWrap: 'wrap',
//                           // alignItems:'center',
//                         }}
//                       >
//                         <img src="https://th.bing.com/th/id/OIP.51jMxjPx1dBlrIAVLcFP9wAAAA?pid=ImgDet&rs=1" />
//                         <p
//                           style={{ padding: 12, width: '50%' }}
//                           className="subtitle">{mainpitch.description}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="columns">
//                     <div className="column is-12">
//                       <h3 className="has-text-weight-semibold is-size-2">
//                         {heading}
//                       </h3>
//                       <p>{description}</p>
//                     </div>
//                   </div>
//                   <Features gridItems={intro.blurbs} />
//                   <div className="columns">
//                     <div className="column is-12 has-text-centered">
//                       <Link className="btn" to="/products">
//                         See all products
//                       </Link>
//                     </div>
//                   </div>
//                   <div className="content">
//                     <div className="tile">
//                       <h1 className="title">{mainpitch.title}</h1>
//                     </div>
//                     <div className="tile">
//                       <div
//                         style={{
//                           display: 'flex',
//                           flexDirection: 'row-reverse',
//                           justifyContent: 'space-evenly',
//                           flexWrap: 'wrap',
//                           // alignItems:'center',
//                         }}
//                       >
//                         <img src="https://th.bing.com/th/id/OIP.51jMxjPx1dBlrIAVLcFP9wAAAA?pid=ImgDet&rs=1" />
//                         <p
//                           style={{ padding: 12, width: '50%' }}
//                           className="subtitle">{mainpitch.description}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="column is-12">
//                     <h3 className="has-text-weight-semibold is-size-2">
//                       Latest stories
//                     </h3>
//                     <BlogRoll />
//                     <div className="column is-12 has-text-centered">
//                       <Link className="btn" to="/blog">
//                         Read more
//                       </Link>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>