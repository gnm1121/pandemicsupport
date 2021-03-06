const businessQuery = `{
  businesses: allGoogleSpreadsheetOpportunitiesApprovedBusinesses {
    edges {
      node {
        objectID: id
        name
        businessType: whatTypeOfBusinessIsIt_
        locations
        donationLink
        giftCardPurchaseLink
        merchandisePurchaseLink
        websiteLink
        socialMediaLink
        onlineOrderingLink
        logoBackgroundColor
        logoImage {
          publicURL
          childImageSharp {
            fixed(width: 130) {
              src
            }
          }
        }
      }
    }
  }
}`

const preprocessBusinesses = (arr) =>
  arr.map(({ node: { locations, supportMethods, logoImage, ...rest } }) => {
    let logoUrl = logoImage.publicURL
    if (logoImage.childImageSharp !== null) {
      logoUrl = logoImage.childImageSharp.fixed.src
    }
    return {
      ...rest,
      addresses: locations.split("|").map((l) => {
        loc = l.split(":")
        return loc[0]
      }),
      logoPublicUrl: process.env.GATSBY_EXTERNAL_BASE_URL + logoUrl,
      _geoloc: locations.split("|").map((l) => {
        loc = l.split(":")
        return {
          lat: parseFloat(loc[1]),
          lng: parseFloat(loc[2]),
        }
      }),
    }
  })

const opportunityQuery = `{
        opportunities: allGoogleSpreadsheetOpportunitiesApprovedHealthcare {
          edges {
            node {
              objectID: id
              name
              opportunityType: whatTypeOfOpportunityIsIt_
              latLng
              websiteLink
              email
              description
              remote
              state
              covid19Cases
              covid19Deaths
              talentNeeded
            }
          }
        }
      }`

const preprocessOpportunity = (arr) =>
  arr.map(
    ({
      node: { latLng, talentNeeded, covid19Cases, covid19Deaths, ...rest },
    }) => ({
      ...rest,
      talentNeeded: talentNeeded.split(","),
      covid19Cases: parseInt(covid19Cases, 10),
      covid19Deaths: parseInt(covid19Deaths, 10),
      _geoloc: {
        lat: parseFloat(latLng.split(":")[0]),
        lng: parseFloat(latLng.split(":")[1]),
      },
    })
  )

const settings = {}

const queries = [
  {
    query: businessQuery,
    transformer: ({ data }) => preprocessBusinesses(data.businesses.edges),
    indexName: process.env.GATSBY_ALGOLIA_BUSINESS_INDEX_NAME,
    settings,
  },
  {
    query: opportunityQuery,
    transformer: ({ data }) => preprocessOpportunity(data.opportunities.edges),
    indexName: process.env.GATSBY_ALGOLIA_OPPORTUNITY_INDEX_NAME,
    settings,
  },
]

module.exports = queries
