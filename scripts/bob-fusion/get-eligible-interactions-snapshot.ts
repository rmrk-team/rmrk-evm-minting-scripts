import 'dotenv/config';
import { gqlClient } from './graphql/graphql-client.js';
import { eligibleEventsQuery } from './graphql/eligible-events-query.js';
import { getOrCreateNdjosnLogFile } from '../utils/get-or-create-ndjosn-log-file.js';
import { Address, isAddress, isAddressEqual } from 'viem';
import type { ResultOf } from 'gql.tada';
import { BITBOB_CONTRACT_ADDRESS } from './consts.js';
import fs from 'fs';

export type EligibilitySnapshot = {
  userAddress: Address;
  transactionHash: Address;
  weight: number;
  id: string;
};

export const DEFAULT_BOB_FUSION_WEIGHT_MAPPING = {
  BITBOB_MINT: 3,
  PURCHASE: 2,
  DEFAULT: 1,
};

type QueryResult = ResultOf<typeof eligibleEventsQuery>;

export const getWeightTypeFromEvent = ({
  eventType,
  transactionHash,
  payload,
  marketplaceEventMetadata,
  token,
}: QueryResult['events'][0]) => {
  if (
    payload.__typename === 'MintEventPayload' &&
    token?.collection?.contractAddress &&
    isAddress(token.collection?.contractAddress) &&
    isAddressEqual(token?.collection.contractAddress, BITBOB_CONTRACT_ADDRESS)
  ) {
    return DEFAULT_BOB_FUSION_WEIGHT_MAPPING.BITBOB_MINT;
  }

  if (payload.__typename === 'ContractEventNewSale') {
    return DEFAULT_BOB_FUSION_WEIGHT_MAPPING.PURCHASE;
  }

  return DEFAULT_BOB_FUSION_WEIGHT_MAPPING.DEFAULT;
};

export const getEligibilityItemsForEvent = (
  event: QueryResult['events'][0],
) => {
  if (
    event.payload.__typename === 'MintEventPayload' &&
    event.eventType === 'TokenMint'
  ) {
    return [
      {
        userAddress: event.payload.to,
        transactionHash: event.transactionHash,
        weight: getWeightTypeFromEvent(event),
        id: event.id,
      },
    ];
  }

  if (
    event.payload.__typename === 'ContractEventNewSale' &&
    event.eventType === 'NewSale'
  ) {
    const eligibility = [
      {
        userAddress: event.payload.buyer,
        transactionHash: event.transactionHash,
        weight: getWeightTypeFromEvent(event),
        id: event.id,
      },
    ];

    if (event.marketplaceEventMetadata?.listingCreator) {
      eligibility.push({
        userAddress: event.marketplaceEventMetadata.listingCreator,
        transactionHash: event.transactionHash,
        weight: getWeightTypeFromEvent(event),
        id: event.id,
      });
    }

    return eligibility;
  }

  if (
    event.payload.__typename === 'CollectionAddedEventPayload' &&
    event.eventType === 'CollectionAdded'
  ) {
    return [
      {
        userAddress: event.payload.deployer,
        transactionHash: event.transactionHash,
        weight: getWeightTypeFromEvent(event),
        id: event.id,
      },
    ];
  }

  return [];
};

export type LastDistributed = {
  to: string;
  totalDistributed: number;
  distributionSnapshotPath: string;
}

// BOB fusion api https://app.gobob.xyz/api/docs/static/index.html
export const getEligibleInteractionsSnapshot = async () => {
  const snapshotTimestampsPath = `${process.cwd()}/scripts/bob-fusion/results/last-distributed.ndjson`;
  const snapshotTimestamps = await getOrCreateNdjosnLogFile<LastDistributed>(snapshotTimestampsPath);

  const fromTimestamp =
    snapshotTimestamps?.[snapshotTimestamps.length - 1]?.to ??
    new Date('2024-05-24').toISOString();
  const toTimestamp = new Date().toISOString();

  const logFilePath = `${process.cwd()}/scripts/bob-fusion/results/eligibility-snapshot-${fromTimestamp}-${toTimestamp}.ndjson`;

  const eventsResponse = await gqlClient.request(eligibleEventsQuery, {
    fromTimestamp: fromTimestamp,
  });
  const snapshotLog =
    await getOrCreateNdjosnLogFile<EligibilitySnapshot>(logFilePath);

  for (const eventResponse of eventsResponse.events) {
    const eligibilityItems = getEligibilityItemsForEvent(eventResponse);

    const uniqueItems = eligibilityItems.filter(
      (item) =>
        snapshotLog.findIndex((logItem) => logItem.id === item.id) === -1,
    );
    for (const uniqueItem of uniqueItems) {
      await fs.promises.appendFile(
        logFilePath,
        `${JSON.stringify(uniqueItem)}\n`,
      );
    }
  }

  return {logFilePath, outputFileSuffix: `${fromTimestamp}-${toTimestamp}`}
};
