import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="404: Not Found" />
      <span class="material-icons">back_hand</span>
      <h1>404: Not Found</h1>
      <p>你来到了世界尽头，别人会说你好奇过头</p>
      <p>我不这样认为</p>
      {/* <p>You just hit a route that doesn&#39;t exist... the sadness.</p> */}
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
