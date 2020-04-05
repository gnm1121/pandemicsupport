import React from "react"

import {
  Box,
  Button,
  Anchor,
  Text,
  TextInput,
  CheckBox,
  Heading,
} from "grommet"
import {
  InstantSearch,
  Index,
  connectHits,
  Highlight,
  connectRefinementList,
  createConnector,
  connectPagination,
  Configure,
} from "react-instantsearch-dom"
import places from "places.js"
import algoliasearch from "algoliasearch/lite"
import { Add } from "grommet-icons"

import Layout from "../components/layout"
import SEO from "../components/seo"

const trackGoal = (goalId) => {
  if (typeof window !== "undefined" && "fathom" in window) {
    window.fathom("trackGoal", goalId, 0)
  }
}

const IndexPage = () => {
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_PUBLIC_API_KEY
  )
  return (
    <Layout>
      <SEO title="Pandemic Support" />
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.GATSBY_ALGOLIA_OPPORTUNITY_INDEX_NAME}
      >
        <Heading level={2}>Help your community fight the virus!</Heading>
        <PlacesSearchBox placeholder="Where are you?" />
        <Configure hitsPerPage={10} />
        <Index indexName={process.env.GATSBY_ALGOLIA_OPPORTUNITY_INDEX_NAME}>
          <Box
            direction="row-responsive"
            gap="medium"
            margin={{ top: "small" }}
          >
            <CustomRefinementList
              label="Opportunity type"
              attribute="opportunityType"
            />
            <CustomRefinementList
              label="Remote volunteers welcome?"
              attribute="remote"
            />
            <CustomRefinementList
              label="Who is needed?"
              attribute="talentNeeded"
            />
          </Box>
          <CustomHits hitComponent={OpportunityHit} />
          <CustomPagination />
        </Index>
        <Anchor
          href="https://forms.gle/TFoUSDuq6uC51J5F9"
          target="_blank"
          rel="noopener"
        >
          <Add size="small" /> Add an opportunity
        </Anchor>
        <Heading level={2}>Support local businesses</Heading>
        <Index indexName={process.env.GATSBY_ALGOLIA_BUSINESS_INDEX_NAME}>
          <CustomHits hitComponent={BusinessHit} />
          <CustomPagination />
        </Index>
        <Anchor
          href="https://forms.gle/qhp5cuUS4PVeUa8w8"
          target="_blank"
          rel="noopener"
        >
          <Add size="small" /> Add a business
        </Anchor>
      </InstantSearch>
    </Layout>
  )
}

const Hits = ({ hits, hitComponent }) => (
  <Box
    direction="row-responsive"
    margin={{ bottom: "small" }}
    justify="start"
    wrap
  >
    {hits.map((hit) => (
      <Box
        key={hit.objectID}
        direction="column"
        background="light-3"
        pad="medium"
        align="center"
        round="small"
        margin={{ right: "small", top: "small" }}
        justify="between"
        width="230px"
      >
        {hitComponent({ hit })}
      </Box>
    ))}
  </Box>
)

const OpportunityHit = ({ hit }) => (
  <>
    <Anchor href={hit.websiteLink}>
      <Text>{hit.name}</Text>
    </Anchor>
    {hit.websiteLink && (
      <Button
        label="Support"
        href={hit.websiteLink}
        margin={{ top: "small" }}
        onClick={() => trackGoal("MEBZPZAO")}
      />
    )}
  </>
)

// socialMediaLink
const BusinessHit = ({ hit }) => {
  let url = "",
    label = ""
  if (hit.donationLink) {
    url = hit.donationLink
    label = "Donate"
  } else if (hit.onlineOrderingLink) {
    url = hit.onlineOrderingLink
    label = "Order Online"
  }
  return (
    <>
      <Box justify="center" height={{ min: "100px" }}>
        <Anchor href={hit.websiteLink}>
          {hit.logoPublicUrl ? (
            <img src={hit.logoPublicUrl} alt={hit.name} width="130px" />
          ) : (
            <Text>{hit.name}</Text>
          )}
        </Anchor>
      </Box>
      <Box margin={{ top: "small" }} gap="xsmall" align="center">
        {url !== hit.onlineOrderingLink && hit.onlineOrderingLink && (
          <Anchor
            href={hit.onlineOrderingLink}
            onClick={() => trackGoal("JIEHERJY")}
          >
            Order Online
          </Anchor>
        )}
        {hit.giftCardPurchaseLink && (
          <Anchor
            href={hit.giftCardPurchaseLink}
            onClick={() => trackGoal("JIEHERJY")}
          >
            Buy Gift Cards
          </Anchor>
        )}
        {hit.merchandisePurchaseLink && (
          <Anchor
            href={hit.merchandisePurchaseLink}
            onClick={() => trackGoal("JIEHERJY")}
          >
            Buy Merch
          </Anchor>
        )}
        {hit.socialMediaLink && (
          <Anchor href={hit.socialMediaLink}>Follow Updates</Anchor>
        )}
        {url && (
          <Button
            label={label}
            href={url}
            onClick={() => trackGoal("JIEHERJY")}
          />
        )}
      </Box>
    </>
  )
}

const CustomHits = connectHits(Hits)

const RefinementList = ({
  label,
  searchable,
  items,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
}) => {
  let [searchValue, setSearchValue] = React.useState("")
  return (
    <Box pad="medium" background="light-1" direction="column" gap="xsmall">
      <Text>{label}</Text>
      {searchable && (
        <TextInput
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.currentTarget.value)
            searchForItems(event.currentTarget.value)
          }}
        />
      )}
      {items.map((item) => {
        return (
          <Box key={item.label}>
            <CheckBox
              checked={item.isRefined}
              onChange={(event) => {
                event.preventDefault()
                refine(item.value)
              }}
              label={
                <Anchor
                  href={createURL(item.value)}
                  style={{ fontWeight: item.isRefined ? "bold" : "" }}
                  onClick={(event) => {
                    event.preventDefault()
                    refine(item.value)
                  }}
                >
                  {isFromSearch ? (
                    <Highlight attribute="label" hit={item} />
                  ) : (
                    item.label
                  )}{" "}
                  ({item.count})
                </Anchor>
              }
            />
          </Box>
        )
      })}
    </Box>
  )
}

const CustomRefinementList = connectRefinementList(RefinementList)

const placesConnector = createConnector({
  displayName: "AlgoliaGeoSearch",

  getProvidedProps() {
    return {}
  },

  refine(props, searchState, nextValue) {
    return {
      ...searchState,
      aroundLatLng: nextValue,
      aroundLatLngViaIP: false,
      boundingBox: {},
    }
  },

  getSearchParameters(searchParameters, props, searchState) {
    const currentRefinement = searchState.aroundLatLng

    if (!currentRefinement) {
      return searchParameters.setQueryParameter("aroundLatLngViaIP", true)
    }

    return searchParameters
      .setQueryParameter("insideBoundingBox")
      .setQueryParameter("aroundLatLngViaIP", false)
      .setQueryParameter(
        "aroundLatLng",
        `${currentRefinement.lat}, ${currentRefinement.lng}`
      )
  },
})

class Places extends React.Component {
  createRef = (c) => (this.element = c)

  componentDidMount() {
    const { refine } = this.props

    const autocomplete = places({
      appId: process.env.GATSBY_ALGOLIA_PLACES_APP_ID,
      apiKey: process.env.GATSBY_ALGOLIA_PLACES_PUBLIC_API_KEY,
      container: this.element,
    })

    autocomplete.on("change", (event) => {
      refine(event.suggestion.latlng)
    })

    autocomplete.on("clear", () => {
      refine()
    })
  }

  render() {
    return (
      <input
        ref={this.createRef}
        type="search"
        placeholder={this.props.placeholder}
      />
    )
  }
}

const PlacesSearchBox = placesConnector(Places)

const Pagination = ({ currentRefinement, nbPages, refine, createURL }) => (
  <Box direction="row" justify="center" gap="xsmall" align="center">
    {currentRefinement !== 1 && (
      <Box pad="xsmall" align="center">
        <Anchor onClick={() => refine(currentRefinement + 1)}>Prev</Anchor>
      </Box>
    )}
    {nbPages > 1 &&
      new Array(nbPages).fill(null).map((_, index) => {
        const page = index + 1
        const isCurrentPage = currentRefinement === page

        return (
          <Box border={isCurrentPage ? null : "all"} pad="xsmall">
            {isCurrentPage ? (
              <Text>{page}</Text>
            ) : (
              <Anchor
                key={index}
                href={createURL(page)}
                onClick={(event) => {
                  event.preventDefault()
                  refine(page)
                }}
              >
                {page}
              </Anchor>
            )}
          </Box>
        )
      })}

    {currentRefinement !== nbPages && (
      <Box pad="xsmall" align="center">
        <Anchor onClick={() => refine(currentRefinement + 1)}>Next</Anchor>
      </Box>
    )}
  </Box>
)

const CustomPagination = connectPagination(Pagination)

export default IndexPage
