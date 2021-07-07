import React from "react"
import { Link, graphql } from "gatsby"

import Seo from "../components/seo"

const LandingPage = ({ data }) => {
  return (
    <main className="landing-page-wrapper">
      <Seo title="NEKO" />
      <div className="landing-page-title">
        {/* <Link to="/blog">
          <span class="material-icons">catching_pokemon</span>
        </Link> */}
        <h1>
          <Link to="/blog">{data.site.siteMetadata.title}</Link>
        </h1>
        <Link to="/blog">
          <p>实事求是。</p>
        </Link>
      </div>
    </main>
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
