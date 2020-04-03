import React from "react"

import { Box, Button, Anchor, Text, TextInput, CheckBox } from "grommet"
import {
  InstantSearch,
  Configure,
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
        <PlacesSearchBox
          placeholder="Where are you?"
        />
        <Box
          direction="row-responsive"
          align="start"
          pad="xlarge"
          gap="medium"
        >
          <CustomRefinementList label="Opportunity Type" attribute="opportunityType" />
          <CustomRefinementList label="State" searchable={true} attribute="state" />
          <CustomRefinementList label="Is Remote?" attribute="remote" />
        </Box>
        <CustomHits />
      </InstantSearch>
    </Layout>
  )
}

const Hits = ({ hits }) => (
  <Box
    direction="row-responsive"
    align="start"
    pad="xlarge"
    gap="medium"
  >
    {hits.map(hit => (
      <Box
        key={hit.objectID}
        pad="large"
        align="center"
        background={{ color: "light-3", opacity: "strong" }}
        round
        gap="small"
      >
        <Anchor href={hit.websiteLink}>
          <Text>{hit.name}</Text>
        </Anchor>
        {hit.websiteLink && <Button label="Support" href={hit.websiteLink} />}
      </Box>
    ))}
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
        <Box key={item.label}>
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
