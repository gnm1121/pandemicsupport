import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Header as GrommetHeader, Heading } from "grommet"

const Header = ({ siteTitle }) => (
  <GrommetHeader background="brand" pad={{ left: "xlarge" }}>
    <Heading>
      <Link
        to="/"
        style={{
          color: `white`,
          textDecoration: `none`,
        }}
      >
        {siteTitle}
      </Link>
    </Heading>
  </GrommetHeader>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
