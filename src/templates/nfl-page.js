import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import NflDfsLayout from "../components/layouts/NflDfsLayout";
import NFLDfsSiteTabs from '../components/tabs/NFLDfsSiteTabs';
import LeftSideDrawer from "../components/drawers/LeftSideDrawer";

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
 
  // const heroImage = getImage(image) || image;
  // console.log({
  //   image,
  //   title,
  //   heading,
  //   subheading,
  //   mainpitch,
  //   description,
  //   intro,
  //   main,
  // });

  // console.log("lineups", lineups);
  return (
    <div>
   
      <NFLDfsSiteTabs heading={heading} title={title} />
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
    <NflDfsLayout>

      <DfsPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        description={frontmatter.description}
      />
    </NflDfsLayout>
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
