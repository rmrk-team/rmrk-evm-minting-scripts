import {graphqlRmrkIndexer} from "./graphql-client.js";

export const eligibleEventsQuery = graphqlRmrkIndexer(`
    query eligibleEvents($fromTimestamp: DateTime!) {
      events(where: {block: {network: {id_eq: "bob"}, timestamp_gte: $fromTimestamp}, eventType_in: [TokenMint, NewSale, CollectionAdded]}) {
        id
        block {
          timestamp
          number
        }
        token {
          collection {
            contractAddress
          }
        }
        transactionHash
        eventType
        marketplaceEventMetadata {
          saleType
          listingCreator
        }
        payload {
          ... on MintEventPayload {
            to
            __typename
          }
          ... on ContractEventNewSale {
            buyer
            seller
            tokenAddress
            __typename
          }
          ... on CollectionAddedEventPayload {
            __typename
            collection
            deployer
          }
        }
      }
    }
`)
