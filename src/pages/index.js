//import React
import * as React from 'react'
import Layout from '../components/layout'
import { StaticImage } from 'gatsby-plugin-image'

//define my component
const IndexPage = () => {
  return (
    <Layout pageTitle="Home Page">
      <p>I'm Neko.</p>
      <StaticImage
        alt="img fromwallhaven"
        src="../images/neko.jpg"
        />
    </Layout>
  )
}

//export my component
export default IndexPage