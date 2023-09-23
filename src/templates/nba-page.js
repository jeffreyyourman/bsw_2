import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import Layout from "../components/layouts/Layout";
// import Features from "../components2/Features";
// import BlogRoll from "../components2/BlogRoll";
import FullWidthImage from "../components/FullWidthImage";
import Table from "../components/tables/dfs/nfl/NFLTableFD";
// import PreviewCompatibleImage from "../components2/PreviewCompatibleImage";
import { useTable } from "react-table";
// import LeftSideDrawer from "../components2/drawers/LeftSideDrawer";
// import BottomDrawer from "../components2/drawers/BottomDrawer";
// eslint-disable-next-line
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
  const [lineups, setLineups] = useState([]);
  const [lineupsData, setLineupsData] = useState([]);
  const heroImage = getImage(image) || image;
  console.log({
    image,
    title,
    heading,
    subheading,
    mainpitch,
    description,
    intro,
    main,
  });

  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     const csvData = event.target.result;
  //     const parsedData = csvData.split("\n").map((row) => {
  //       return row.split(",");
  //     });
  //     const headers = parsedData[0];
  //     const rows = parsedData.slice(1);
  //     const formattedData = rows.map((row) => {
  //       return headers.reduce((acc, header, index) => {
  //         acc[header] = row[index];
  //         return acc;
  //       }, {});
  //     });
  //     console.log("formattedData", formattedData);
  //     setData(formattedData);
  //   };
  //   reader.readAsText(file);
  // };
  // console.log("data", data);
  // const data = React.useMemo(
  //   () => [
  //     {
  //       name: "John",
  //       age: 25,
  //       email: "john@example.com",
  //     },
  //     {
  //       name: "Jane",
  //       age: 30,
  //       email: "jane@example.com",
  //     },
  //     {
  //       name: "Bob",
  //       age: 35,
  //       email: "bob@example.com",
  //     },
  //   ],
  //   []
  // );

  // const columns = React.useMemo(
  //   () => [
  //     {
  //       Header: "Name",
  //       accessor: "name",
  //     },
  //     {
  //       Header: "Age",
  //       accessor: "age",
  //     },
  //     {
  //       Header: "Email",
  //       accessor: "email",
  //     },
  //   ],
  //   []
  // );

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  // } = useTable({
  //   columns,
  //   data,
  // });

  // console.log("lineups", lineups);
  return (
    <div>
      <FullWidthImage img={heroImage} title={title} subheading={subheading} />
      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-12">
                {/* <h3 className="has-text-weight-semibold is-size-2">
                  {'NBA DFS'}
                </h3>
                <p>{'Coming soon'}</p> */}

                {/* <Table lineups={lineups} setLineups={setLineups} setLineupsData={setLineupsData} /> */}
                {/* <div></div> */}
              </div>
              {/* <div className="column is-10 is-offset-1">
                <div className="content">
                  <div className="columns">
                    <div className="column is-12">
                      <h3 className="has-text-weight-semibold is-size-2">
                        {heading}
                      </h3>
                      <p>{description}</p>
                      
                      <Table />
                    </div>
                  </div> 
                </div>
              </div>*/}
            </div>
          </div>
        </div>
      </section>
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
    <Layout>
      {/* <LeftSideDrawer /> */}

      <DfsPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        description={frontmatter.description}
      />
    </Layout>
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
