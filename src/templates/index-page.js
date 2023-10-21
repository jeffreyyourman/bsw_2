import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import Layout from "../components/layouts/Layout";
import Features from "../components/Features";
import BlogRoll from "../components/BlogRoll";
import FullWidthImage from "../components/FullWidthImage_split";
import { Star } from '@mui/icons-material';
import { SignedIn, SignedOut, UserButton, useClerk, useAuth } from "@clerk/clerk-react";


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
import dalle1 from "../img/dalle/dalle1.png";
import dalle2 from "../img/dalle/dalle2.png";
import dalle3 from "../img/dalle/dalle3.png";
import dalle4 from "../img/dalle/dalle4.png";
import dalle5 from "../img/dalle/dalle5.png";
import dalle6 from "../img/dalle/dalle6.png";
import dalle7 from "../img/dalle/dalle7.png";
import dalle8 from "../img/dalle/dalle8.png";
import dalle9 from "../img/dalle/dalle9.png";
import dalle10 from "../img/dalle/dalle10.png";
import dalle11 from "../img/dalle/dalle11.png";
import dalle12 from "../img/dalle/dalle12.png";
import dalle_full1 from "../img/dalle/dalle_full1.png";
import dalle_full2 from "../img/dalle/dalle_full2.png";
import dalle_full3 from "../img/dalle/dalle_full3.png";
import dalle_full4 from "../img/dalle/dalle_full4.png";
import dalle_full5 from "../img/dalle/dalle_full5.png";

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
          {/* <img src="https://picsum.photos/600/300" alt="Graph" style={{ width: '100%', borderRadius: 4 }} /> */}
          <img src={props.imageSrc} alt="Graph" style={{ width: '600px', borderRadius: 4 }} />
        </div>

      </div>
      {/* {props.actionWrapper && <div>{props.actionWrapper}</div>} */}
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
          <img src={props.imgSrc} alt="Graph" style={{ width: '300px', borderRadius: 4 }} />
        </div>

      </div>
    </div >
  )
}

const FulLWidthImgCustom = (props) => {
  return (
    <div style={{ margin: '-20px' }}>
      <img src={props.src} alt="Graph" style={{ width: '100%', height: '400px', borderRadius: 4 }} />
    </div>
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
            BetSweatWin Analytics: Next-Gen Sports Statistics!
          </h1>
          <h2 style={{
            marginTop: 16,
            fontSize: 24,
          }}>
            Dive into BetSweatWin Analytics, where cutting-edge technology meets unparalleled sports insights. Elevate your sports experience with tools and insights tailored for today's enthusiast.
          </h2>
          {/* <Typography variant="h3" color="secondary">Win More Bets</Typography> */}
          <div style={{
            marginTop: 32,
          }}>
            {props.actionWrapper}
            {/* <Button variant="contained" color="primary" style={{ marginRight: 8 }}>Upgrade Now</Button>
            <Button variant="contained" color="secondary">Upgrade For Free!</Button> */}
            <SocialIconsRow />
          </div>
        </div>
        {/* right side */}
        <div>
          <img src={dalle1} alt="BSW_Header" style={{ width: '600px', borderRadius: 4 }} />
          {/* <img src="https://picsum.photos/600/300" alt="Graph" style={{ width: '100%', borderRadius: 4 }} /> */}

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
        }}>
          Discover the unparalleled suite of tools and services offered by BetSweatWin Analytics. Designed for both novices and experts, we're here to elevate your sports analytics experience.


        </p>
      </div>


      <TextImageRow
        // sectionBgColor={}
        textDirection={'row'}
        sectionTitle={'Elite Analytics Dashboard'}
        sectionDescription={'Get a glimpse of the most detailed statistics, charts, and predictions curated by our top analysts. Enhance your betting game by understanding the nuances of every match, player, and team.'}
        imgSrc={dalle11}
      // actionWrapper={ }
      />
      <TextImageRow
        // sectionBgColor={}
        textDirection={"row-reverse"}
        sectionTitle={"Comprehensive Training Modules"}
        sectionDescription={"We offer in-depth training modules and tutorials to help our users understand the world of sports betting. From the basics to advanced strategies, we've got you covered."}
        // actionWrapper={ }
        imgSrc={dalle8}
      />

      <TextImageRow
        // sectionBgColor={}
        textDirection={"row"}
        sectionTitle={"Community & Expert Forums"}
        sectionDescription={"Join our community of avid sports enthusiasts and betting experts. Engage in discussions, share insights, ask questions, and learn from the best in the industry."}
        imgSrc={dalle9}
      // actionWrapper={ }
      />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: props.textDirection,
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        margin: '16px 0px 20px 0px',
        paddingBottom: 16,
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
            {props.actionWrapper}
          </div>
        </div>
        {/* right side */}
        <div>
          <img src={dalle12} alt="Graph" style={{ width: '500px', borderRadius: 4 }} />
        </div>

      </div>

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
  const { isSignedIn, sessionId, userId } = useAuth();

  // useEffect(() => {
  //  window.location.href='/about' 
  // },[])
  return (
    <>
      <HeaderComponent
        textDirection={'row'}
        sectionBgColor={'#99e6ff'}
        actionWrapper={!isSignedIn ?
          <Button variant="contained" color="primary" style={{ marginRight: 8 }}>Sign up now!</Button> :
          <Button variant="contained" color="secondary">Upgrade For Free!</Button>
        }
      />
      <TextImageRowSection
        sectionBgColor={'#eff3fc'}
        textDirection={'row-reverse'}
        sectionTitle={'About BetSweatWin Analytics'}
        sectionDescription={"At BetSweatWin Analytics, we're more than just a sports analytics company - we're your partner in elevating your sports experience. Our journey is deeply rooted in a passion for sports, combined with the power of cutting-edge analytics, bringing you the best of both worlds."}
        actionWrapper={<div style={{
          marginTop: 32,
        }}>
          <h2 style={{ fontSize: 24 }}>What Sets Us Apart:</h2>
          <ul>
            <li><strong>Expertise & Passion:</strong> Our team consists of sports veterans and analytics experts, ensuring that every piece of content, every tool, and every insight is top-notch and credible.</li>
            <li><strong>Affordability:</strong> We take pride in being the most affordable analytics dashboard in the industry, making sure that high-quality sports analytics are accessible to all.</li>
            <li><strong>Innovation & Future-Ready Tools:</strong> With our advanced AI intelligence model, we're not just keeping up with the trends; we're setting them. Our tools evolve, learn, and adapt, ensuring you're always ahead of the game.</li>
            <li><strong>Community at Heart:</strong> BetSweatWin is not just a platform; it's a community. We listen, engage, and grow with our users. Your feedback and success stories are our driving force.</li>
          </ul>
        </div>}
        imageSrc={dalle2}
      />

      {/* <FullWidthImage img={heroImage} /> */}
      <FulLWidthImgCustom src={dalle_full5} />

      <ServiceSection
        textDirection={'row-reverse'}
        sectionBgColor={'#99e6ff'}
        actionWrapper={!isSignedIn ?
          <Button variant="contained" color="primary" style={{ marginRight: 8 }}>Sign up now!</Button> :
          <Button variant="contained" color="secondary">Upgrade For Free!</Button>
        }

      />

      {/* <FullWidthImage img={dalle_full1} /> */}
      <FulLWidthImgCustom src={dalle_full1} />
      {/* dalle_full1
dalle_full2
dalle_full3 */}
      <TextImageRowSection
        sectionBgColor={'#eff3fc'}
        textDirection={'row'}
        sectionTitle={'Why BetSweatWin Analytics'}

        sectionDescription={"At BetSweatWin, innovation is in our DNA. We're constantly pushing boundaries to offer the most advanced analytics in the industry. Our platform is built with you, the community, at its heart—taking advice and feedback from our valued users to continually refine our services. Reliability is not just a promise; it's our ethos. We pride ourselves on nurturing strong partnerships, ensuring that every aspect of our service exceeds expectations. Dive into a realm where data meets passion and where you, our community, guide the future."}
        imageSrc={dalle3}
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