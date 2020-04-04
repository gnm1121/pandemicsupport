import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

export default (props) => {

  const data = useStaticQuery(graphql`
    query {
        file(relativePath: {eq: "icon.svg"}) {
            publicURL
        }
    }
    `)
  return (
    <img src={data.file.publicURL} alt="pandemic support" {...props} />
  )
}