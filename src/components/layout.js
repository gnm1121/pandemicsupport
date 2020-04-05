import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"
import { Grommet, Anchor, Main, Footer, Text } from "grommet"
import { grommet } from "grommet/themes";

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Grommet
      theme={grommet}
    >
      <Header siteTitle={data.site.siteMetadata.title} />
      <Main pad={{left:"xlarge", right:"xlarge", top:"medium", bottom:"medium"}}>
        {children}
      </Main>
      <Footer background="light-4" justify="center" pad="small">
        <Text textAlign="center" size="small">
          © {new Date().getFullYear()}
          { ` Built with icons made by `}
          <Anchor href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</Anchor>
          { ` from `} <Anchor href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</Anchor>
        </Text>
      </Footer>
    </Grommet>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
