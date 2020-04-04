import React from "react"

import { Box, Button, Anchor, Text, TextInput, CheckBox, Heading } from "grommet"
import {
  InstantSearch,
  Index,
  connectHits,
  Highlight,
  connectRefinementList,
  createConnector,
} from "react-instantsearch-dom"
import places from 'places.js'
import algoliasearch from "algoliasearch/lite"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => {
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_PUBLIC_API_KEY
  );
  return (
    <Layout>
      <SEO title="Pandemic Support" />
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.ALGOLIA_OPPORTUNITY_INDEX_NAME}
      >
        <Heading level={2}>Help your community fight the virus!</Heading>
        <PlacesSearchBox
          placeholder="Where are you?"
        />
        <Index indexName={process.env.ALGOLIA_OPPORTUNITY_INDEX_NAME}>
          <Box
            direction="row-responsive"
            gap="medium"
            margin={{top: "small"}}
          >
            <CustomRefinementList label="Opportunity type" attribute="opportunityType" />
            <CustomRefinementList label="Remote volunteers welcome?" attribute="remote" />
          </Box>
          <CustomHits hitComponent={OpportunityHit} />
        </Index>
        <Heading level={2}>Support local businesses</Heading>
        {/* <Index indexName={process.env.ALGOLIA_BUSINESS_INDEX_NAME}>
          <Box
            direction="row-responsive"
            align="start"
            pad="xlarge"
            gap="medium"
          >
            <CustomRefinementList label="Business type" attribute="businessType" />
            <CustomHits hitComponent={BusinessHit} />
          </Box>
        </Index> */}
      </InstantSearch>
    </Layout>
  )
}

const Hits = ({ hits, hitComponent }) => (
  <Box
    direction="row-responsive"
    gap="medium"
  >
    {hits.map(hit =>
      hitComponent({ hit })
    )}
  </Box>
);

const OpportunityHit = ({ hit }) => (
  <Box
    key={hit.objectID}
    pad="large"
    align="center"
    background="light-3"
    round
  >
    <Anchor href={hit.websiteLink}>
      <Text>{hit.name}</Text>
    </Anchor>
    {hit.websiteLink && <Button label="Support" href={hit.websiteLink} />}
  </Box>
);

const BusinessHit = ({ hit }) => (
  <Box
    key={hit.objectID}
    pad="large"
    align="center"
    background={{ color: "light-3", opacity: "strong" }}
    round
    gap="small"
  >
    <img
      src={hit.logoPublicUrl}
      alt={hit.name}
      width="100px"
    />
    <Anchor href={hit.websiteLink}>
      <Text>{hit.name}</Text>
    </Anchor>
    {hit.websiteLink && <Button label="Support" href={hit.websiteLink} />}
  </Box>
);

const CustomHits = connectHits(Hits);

const RefinementList = ({
  label,
  searchable,
  items,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
}) => {
  let [searchValue, setSearchValue] = React.useState('');
  return (
    <Box
      pad="medium"
      background="light-1"
      direction="column"
      gap="xsmall"
    >
      <Text>{label}</Text>
      {searchable && <TextInput
        value={searchValue}
        onChange={event => {
          setSearchValue(event.currentTarget.value);
          searchForItems(event.currentTarget.value);
        }}
      />}
      {items.map(item => {
        return (
        <Box
          key={item.label}
        >
          <CheckBox
            checked={item.isRefined}
            onChange={event => {
              event.preventDefault();
              refine(item.value);
            }}
            label={<Anchor
              href={createURL(item.value)}
              style={{ fontWeight: item.isRefined ? 'bold' : '' }}
              onClick={event => {
                event.preventDefault();
                refine(item.value);
              }}
            >
              {isFromSearch ? (
                <Highlight attribute="label" hit={item} />
              ) : (
                item.label
              )}{' '}
              ({item.count})
            </Anchor>}
          />
        </Box>
      )})}
  </Box>
)};

const CustomRefinementList = connectRefinementList(RefinementList);


const placesConnector = createConnector({
  displayName: 'AlgoliaGeoSearch',

  getProvidedProps() {
    return {};
  },

  refine(props, searchState, nextValue) {
    return {
      ...searchState,
      aroundLatLng: nextValue,
      aroundLatLngViaIP: false,
      boundingBox: {},
    };
  },

  getSearchParameters(searchParameters, props, searchState) {
    const currentRefinement =
      searchState.aroundLatLng;

    if (!currentRefinement) {
      return searchParameters.setQueryParameter('aroundLatLngViaIP', true);
    }

    return searchParameters
      .setQueryParameter('insideBoundingBox')
      .setQueryParameter('aroundLatLngViaIP', false)
      .setQueryParameter(
        'aroundLatLng',
        `${currentRefinement.lat}, ${currentRefinement.lng}`
      );
  },
});

class Places extends React.Component {

  createRef = c => (this.element = c);

  componentDidMount() {
    const { refine } = this.props;

    const autocomplete = places({
      appId: process.env.GATSBY_ALGOLIA_PLACES_APP_ID,
      apiKey: process.env.GATSBY_ALGOLIA_PLACES_PUBLIC_API_KEY,
      container: this.element,
    });

    autocomplete.on('change', event => {
      refine(event.suggestion.latlng);
    });

    autocomplete.on('clear', () => {
      refine();
    });
  }

  render() {
    return (
      <input
        ref={this.createRef}
        type="search"
        placeholder={this.props.placeholder}
      />
    );
  }
}

const PlacesSearchBox = placesConnector(Places);


export default IndexPage
