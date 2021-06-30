import React from "react"
import { Link, graphql } from "gatsby"

const LandingPage = ({ data }) => {
  return (
    <body className="landing-page-wrapper">
      <div className="landing-page-title">
        <Link to="/blog">
          <span class="material-icons">catching_pokemon</span>
        </Link>
        <h1>
          <Link to="/blog">{data.site.siteMetadata.title}</Link>
        </h1>
      </div>
    </body>
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
