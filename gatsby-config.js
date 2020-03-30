require("dotenv").config({
  path: `.env`,
});
module.exports = {
  siteMetadata: {
    title: `Pandemic Support`,
    description: `Support local businesses who are dealing with the repurcussions of covid-19.`,
    author: `Gabe Mulley`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `pandemic-support`,
        short_name: `pandemic-support`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-source-google-spreadsheet",
      options: {
        spreadsheetId: "1tL6PqwVhj0Aa3COGlmokdjy_QYd6W__HUph1tJRivbI",
    
        // The `spreadsheetName` is recommended, but optional
        // It is used as part of the id's during the node creation, as well as in the generated GraphQL-schema
        // If you are sourcing multiple sheets, you can set this to distringuish between the source data
        spreadsheetName: "LocalBusiness",
    
        // The `typePrefix` is optional, default value is "GoogleSpreadsheet"
        // It is used as part of the id's during the node creation, as well as in the generated GraphQL-schema
        // It can be overridden to fully customize the root query
        typePrefix: "GoogleSpreadsheet",
        credentials: {
          client_email: process.env.GOOGLE_SPREADSHEET_AUTH_EMAIL,
          private_key: process.env.GOOGLE_SPREADSHEET_AUTH_PRIVATE_KEY.replace(/\\n/gm, '\n')
        }
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
