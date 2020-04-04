import React from "react"
import { graphql, useStaticQuery } from "gatsby"

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