import * as winston from 'winston';
import { proxyPost } from './proxy';

const GRAPHQL_URL = 'https://www.olx.pl/apigateway/graphql';

const LISTING_QUERY = `query ListingSearchQuery(
  $searchParameters: [SearchParameter!] = []
) {
  clientCompatibleListings(searchParameters: $searchParameters) {
    __typename
    ... on ListingSuccess {
      __typename
      data {
        id
        title
        url
        created_time
        params {
          key
          name
          type
          value {
            __typename
            ... on PriceParam {
              value
              label
              currency
            }
          }
        }
        map {
          lat
          lon
        }
      }
      metadata {
        total_elements
        visible_total_count
      }
    }
    ... on ListingError {
      __typename
      error {
        code
        detail
        status
        title
      }
    }
  }
}`;

export async function olxRequest(
  searchParams: Array<{ key: string; value: string }>,
  referer: string,
  logger: winston.Logger,
): Promise<string[]> {
  try {
    const data = await proxyPost<any>(
      GRAPHQL_URL,
      { query: LISTING_QUERY, variables: { searchParameters: searchParams, fetchPayAndShip: false } },
      { headers: { 'content-type': 'application/json', origin: 'https://www.olx.pl', referer }, timeoutMs: 30_000 },
      logger,
    );
    return data.data?.clientCompatibleListings?.data?.map((item: any) => item.url as string) ?? [];
  } catch (err) {
    const e = err as any;
    const status = e?.response?.status;
    logger.warn(`OLX GraphQL HTTP ${status ?? 'n/a'}`);
    return [];
  }
}

