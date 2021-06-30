import React from "react"
import { Link, graphql } from "gatsby"

const LandingPage = ({ data }) => {
  return (
    <div className="landing-page-wrapper">
      <Link to="/blog">
        <h1>{data.site.siteMetadata.title}</h1>
      </Link>
      <p>Page Building...</p>
    </div>
  )
}

export default LandingPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
