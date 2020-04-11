const React = require("react")

exports.onRenderBody = ({ pathname, setHeadComponents }) => {
  setHeadComponents([
    <meta
      property="og:url"
      content={`${process.env.GATSBY_EXTERNAL_BASE_URL}${pathname}`}
    />,
  ])
}
