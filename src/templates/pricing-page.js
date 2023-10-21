import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import Layout from "../components/layouts/Layout";
import Pricing from "../components/Pricing";
import FullWidthImage from "../components/FullWidthImage";

// eslint-disable-next-line
export const PricingPageTemplate = ({
  image,
  title,
  fullImage,
  pricing,
}) => {
  const heroImage = getImage(image) || image;

  return (
    <div className="content">
      <FullWidthImage img={heroImage} title={title} />
      <section className="section section--gradient">

        <div className="column is-10 is-offset-1">
          <h2 className="has-text-weight-semibold is-size-2">
            {pricing.heading}
          </h2>
          <p

            className="is-size-5">{pricing.description}</p>
          <Pricing data={pricing.plans} />
        </div>
      </section>

    </div>
  );
};

PricingPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array,
  }),
  main: PropTypes.shape({
    heading: PropTypes.string,
    description: PropTypes.string,
    image1: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    image2: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    image3: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }),
  testimonials: PropTypes.array,
  fullImage: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  pricing: PropTypes.shape({
    heading: PropTypes.string,
    description: PropTypes.string,
    plans: PropTypes.array,
  }),
};

const PricingPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <Layout>
      <PricingPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        description={frontmatter.description}
        intro={frontmatter.intro}
        main={frontmatter.main}
        testimonials={frontmatter.testimonials}
        fullImage={frontmatter.full_image}
        pricing={frontmatter.pricing}
      />
    </Layout>
  );
};

PricingPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default PricingPage;

export const PricingPageQuery = graphql`
  query PricingPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        image {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        heading
        description
        intro {
          blurbs {
            image {
              childImageSharp {
                gatsbyImageData(width: 240, quality: 64, layout: CONSTRAINED)
              }
            }
            text
          }
          heading
          description
        }
        main {
          heading
          description
          image1 {
            alt
            image {
              childImageSharp {
                gatsbyImageData(width: 526, quality: 92, layout: CONSTRAINED)
              }
            }
          }
          image2 {
            alt
            image {
              childImageSharp {
                gatsbyImageData(width: 526, quality: 92, layout: CONSTRAINED)
              }
            }
          }
          image3 {
            alt
            image {
              childImageSharp {
                gatsbyImageData(quality: 72, layout: FULL_WIDTH)
              }
            }
          }
        }
        testimonials {
          author
          quote
        }

        full_image {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        pricing {
          heading
          description
          plans {
            description
            items
            plan
            price
          }
        }
      }
    }
  }
`;
