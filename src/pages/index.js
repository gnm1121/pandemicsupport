import React from "react"
import qs from 'qs'

import {
  Box,
  Button,
  Anchor,
  Text,
  TextInput,
  CheckBox,
  Heading,
  Paragraph,
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
  connectSearchBox,
  connectPoweredBy,
  connectStats,
  connectHitInsights,
} from "react-instantsearch-dom"
import places from "places.js"
import algoliasearch from "algoliasearch/lite"

import Layout from "../components/layout"
import SEO from "../components/seo"

import AlgoliaLogo from "../images/algolia.inline.svg"

const DEBOUNCE_TIME = 1000;
const GOAL_ID = {
  'Clicked Business Primary': 'JIEHERJY',
  'Clicked Business Secondary': '8MROVIYE',
  'Clicked Opportunity': 'MEBZPZAO',
}

const trackGoal = (eventName, insights) => {
  if (typeof window !== "undefined" && "fathom" in window) {
    window.fathom("trackGoal", GOAL_ID[eventName], 0)
  }
  insights('clickedObjectIDsAfterSearch', {
    eventName: eventName
  })
}

const qsOptions = {
  allowDots: true,
}

const createURL = state => `/?${qs.stringify(state, qsOptions)}`;

const getUserToken = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
const USER_TOKEN = getUserToken();

const sendHitInsights = (ignored, payload) => {
  const appId = process.env.GATSBY_ALGOLIA_APP_ID;
  const apiKey = process.env.GATSBY_ALGOLIA_PUBLIC_API_KEY;
  const url = `https://insights.algolia.io/1/events?X-Algolia-Application-Id=${appId}&X-Algolia-API-Key=${apiKey}`
  const serializedData = JSON.stringify({
    events: [
      {
        eventType: 'click',
        eventName: payload.eventName,
        userToken: USER_TOKEN,
        index: payload.index,
        queryID: payload.queryID,
        objectIDs: payload.objectIDs,
        positions: payload.positions,
      }
    ]
  });
  if (navigator && typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon(url, serializedData);
  } else {
    const report = new XMLHttpRequest();
    report.open("POST", url);
    report.send(serializedData);
  }
}

const IndexPage = () => {
  let initialSearchState = null;
  if (typeof window !== 'undefined') {
    initialSearchState = qs.parse(window.location.search.slice(1), qsOptions)
  }
  const [searchState, setSearchState] = React.useState(initialSearchState);
  const [debouncedSetState, setDebouncedSetState] = React.useState(null);

  const onSearchStateChange = updatedSearchState => {
    clearTimeout(debouncedSetState);

    setDebouncedSetState(
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.history.pushState({}, null, updatedSearchState ? createURL(updatedSearchState) : '')
        }
      }, DEBOUNCE_TIME)
    );

    setSearchState(updatedSearchState);
  };
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_PUBLIC_API_KEY
  )
  const pledgeText = 'I will practice social distancing and wear a mask in public if not to protect myself than to protect the vulnerable around me.';
  return (
    <Layout>
      <SEO title="Pandemic Support" />
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.GATSBY_ALGOLIA_OPPORTUNITY_INDEX_NAME}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createURL={createURL}
      >
        <PlacesSearchBox placeholder="Where are you?" />
        <Configure hitsPerPage={20} clickAnalytics />
        <Heading level={2}>Volunteer and donate</Heading>
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
          <Box pad={{top: "small", bottom: "small"}}>
            <CustomStats
              labelSingular="opportunity"
              labelPlural="opportunities"
            />
          </Box>
          <CustomHits hitComponent={OpportunityHit} />
          <CustomPagination />
          <Box direction="row" justify="end">
            <CustomPoweredBy />
          </Box>
        </Index>
        <Anchor
          href="https://docs.google.com/forms/d/e/1FAIpQLScnMsXpvI1UUWmFa7N4aAGgpbRm-jGOBlpp6z59ZmdTpVIxBA/viewform"
          target="_blank"
          rel="noopener noreferrer"
        >
          Add an opportunity
        </Anchor>
        <Heading level={2}>Support local businesses</Heading>
        <Index indexName={process.env.GATSBY_ALGOLIA_BUSINESS_INDEX_NAME}>
          <CustomSearchBox />
          <Box pad={{top: "small", bottom: "small"}}>
            <CustomStats
              labelSingular="business"
              labelPlural="businesses"
            />
          </Box>
          <CustomHits hitComponent={BusinessHit} />
          <CustomPagination />
          <Box direction="row" justify="end">
            <CustomPoweredBy />
          </Box>
        </Index>
        <Anchor
          href="https://docs.google.com/forms/d/e/1FAIpQLSc81m4TMbuG-3E2LhbMk4zoWc6V6s8DQpnt22EyPXrRvEb_Pw/viewform"
          target="_blank"
          rel="noopener noreferrer"
        >
          Add a business
        </Anchor>
      </InstantSearch>
      <Heading level={2}>Slow the spread by wearing a mask</Heading>
      <Anchor className="mobile-only" href="https://youtu.be/tPx1yqvJgf4" target="_blank" rel="noopener">CDC Mask Making Tutorial</Anchor>
      <iframe className="desktop-only" title="CDC Mask Making Tutorial" width="560" height="315" src="https://www.youtube-nocookie.com/embed/tPx1yqvJgf4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      <Heading level={2}>Take the social distancing pledge</Heading>
      <Paragraph>
        {pledgeText}
      </Paragraph>
      <Box
        direction="row-responsive"
        gap="xsmall"
      >
        <Button target="_blank" rel="noopener" label="Share on Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.GATSBY_EXTERNAL_BASE_URL)}`} onClick={() => trackGoal("VAKTHKUS")} />
        <Button target="_blank" rel="noopener" label="Tweet This" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(pledgeText)}%20%23flattenthecurve%0A%0A${encodeURIComponent(process.env.GATSBY_EXTERNAL_BASE_URL)}`} onClick={() => trackGoal("VAKTHKUS")} />
      </Box>
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
        {connectHitInsights(sendHitInsights)(hitComponent)({ hit })}
      </Box>
    ))}
  </Box>
)

const OpportunityHit = ({ hit, insights }) => (
  <>
    <Anchor href={hit.websiteLink}>
      <Text>{hit.name}</Text>
    </Anchor>
    {hit.websiteLink && (
      <Button
        label="Support"
        href={hit.websiteLink}
        margin={{ top: "small" }}
        onClick={() => trackGoal('Clicked Opportunity', insights)}
      />
    )}
  </>
)

// socialMediaLink
const BusinessHit = ({ hit, insights }) => {
  let url = "",
    label = ""
  if (hit.donationLink) {
    url = hit.donationLink
    label = "Donate"
  } else if (hit.onlineOrderingLink) {
    url = hit.onlineOrderingLink
    label = "Order Online"
  } else if (hit.giftCardPurchaseLink) {
    url = hit.giftCardPurchaseLink
    label = "Buy Gift Cards"
  }
  let boxStyle = {}
  if (hit.logoBackgroundColor) {
    boxStyle['backgroundColor'] = hit.logoBackgroundColor
  }
  return (
    <>
      <Box justify="center" height={{ min: "130px" }} style={boxStyle} pad="xsmall">
        <Anchor
          href={hit.websiteLink}
          onClick={() => trackGoal('Clicked Business Secondary', insights)}
        >
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
            onClick={() => trackGoal('Clicked Business Secondary', insights)}
          >
            Order Online
          </Anchor>
        )}
        {url !== hit.giftCardPurchaseLink && hit.giftCardPurchaseLink && (
          <Anchor
            href={hit.giftCardPurchaseLink}
            onClick={() => trackGoal('Clicked Business Secondary', insights)}
          >
            Buy Gift Cards
          </Anchor>
        )}
        {hit.merchandisePurchaseLink && (
          <Anchor
            href={hit.merchandisePurchaseLink}
            onClick={() => trackGoal('Clicked Business Secondary', insights)}
          >
            Buy Merch
          </Anchor>
        )}
        {hit.socialMediaLink && (
          <Anchor
            href={hit.socialMediaLink}
            onClick={() => trackGoal('Clicked Business Secondary', insights)}
          >
            Follow Updates
          </Anchor>
        )}
        {url && (
          <Button
            label={label}
            href={url}
            onClick={() => trackGoal('Clicked Business Primary', insights)}
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

const Pagination = ({ currentRefinement, nbPages, refine, createURL }) => {
  if (currentRefinement > nbPages && nbPages > 0) {
    refine(1);
    return (<></>)
  }
  return (
    <Box direction="row" justify="center" gap="xsmall" align="center">
      {currentRefinement !== 1 && (
        <Box pad="xsmall" align="center">
          <Anchor onClick={() => refine(currentRefinement - 1)}>Prev</Anchor>
        </Box>
      )}
      {nbPages > 1 &&
        new Array(nbPages).fill(null).map((_, index) => {
          const page = index + 1
          const isCurrentPage = currentRefinement === page

          return (
            <Box border={isCurrentPage ? null : "all"} pad="xsmall" key={page}>
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

      {currentRefinement !== nbPages && nbPages > 0 && (
        <Box pad="xsmall" align="center">
          <Anchor onClick={() => refine(currentRefinement + 1)}>Next</Anchor>
        </Box>
      )}
    </Box>
  )
}

const CustomPagination = connectPagination(Pagination)


const SearchBox = ({ currentRefinement, refine }) => (
  <TextInput
    type="search"
    placeholder="What is the name of the business?"
    value={currentRefinement}
    onChange={event => refine(event.currentTarget.value)}
  />
);

const CustomSearchBox = connectSearchBox(SearchBox);

const PoweredBy = ({ url }) => (
  <Box
    direction="row"
    gap="xsmall"
  >
    <Text size="small">Search by </Text>
    <Anchor
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <AlgoliaLogo width={70} />
    </Anchor>
  </Box>
)
const CustomPoweredBy = connectPoweredBy(PoweredBy);

const Stats = ({ nbHits, labelSingular, labelPlural }) => (
  <Text>
    Found {nbHits} {nbHits === 1 ? labelSingular : labelPlural}
  </Text>
);

const CustomStats = connectStats(Stats);

export default IndexPage
