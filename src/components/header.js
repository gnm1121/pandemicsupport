import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Header as GrommetHeader, Heading } from "grommet"

import Logo from "../images/icon.inline.svg"

const Header = ({ siteTitle }) => (
  <GrommetHeader background="brand" pad={{ left: "small" }}>
    <Heading>
      <Link
        to="/"
        style={{
          color: `white`,
          textDecoration: `none`,
        }}
      >
        <Logo width="40px" style={{ fill: `white`, marginRight: `10px` }} />
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
