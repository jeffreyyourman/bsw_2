import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import NbaDfsLayout from "../components/layouts/NbaDfsLayout";
import NBADfsSiteTabs from '../components/tabs/NBADfsSiteTabs';

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
   
      <NBADfsSiteTabs heading={heading} title={title} />
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
    <NbaDfsLayout>

      <DfsPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        description={frontmatter.description}
      />
    </NbaDfsLayout>
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
    markdownRemark(frontmatter: { templateKey: { eq: "nba-page" } }) {
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
