import { getOrCreateNdjosnLogFile } from '../utils/get-or-create-ndjosn-log-file.js';
import { EligibilitySnapshot } from './get-eligible-interactions-snapshot.js';
import { Address } from 'viem';
import fs from 'fs';

type PerAddressSnapshotItem = {
  address: Address;
  weight: number;
};

export type PerAddressSnapshot = Record<Address, PerAddressSnapshotItem>;

export const sumPointsFromSnapshot = async (
  snapshotPath: string,
  outputFileSuffix: string,
) => {
  const snapshotLog =
    await getOrCreateNdjosnLogFile<EligibilitySnapshot>(snapshotPath);

  const perAddressSnapshot: PerAddressSnapshot = {};

  for (const item of snapshotLog) {
    if (!perAddressSnapshot[item.userAddress]) {
      perAddressSnapshot[item.userAddress] = {
        address: item.userAddress,
        weight: item.weight,
      };
    } else {
      perAddressSnapshot[item.userAddress].weight += item.weight;
    }
  }

  const outputFilePath = `${process.cwd()}/scripts/bob-fusion/results/summed-weight-${outputFileSuffix}.json`;

  await fs.promises.writeFile(
    outputFilePath,
    JSON.stringify(perAddressSnapshot, null, 2),
  );

  return { outputFilePath, outputFileSuffix };
};
