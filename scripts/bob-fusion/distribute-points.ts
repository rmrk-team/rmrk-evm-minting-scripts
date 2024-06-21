import fs from 'fs';
import { PerAddressSnapshot } from './sum-points-from-snapshot.js';
import { BOB_FUSION_API_URL } from './consts.js';
import { Address } from 'viem';
import { LastDistributed } from './get-eligible-interactions-snapshot.js';

type Partner = {
  name: string;
  ref_code: string;
  category: string;
  project_url: string;
  total_distributed_points: string;
  total_deposit_points: string;
  total_referral_points: string;
  total_tvl_points: string;
  total_gas_points: string;
  total_points: string;
  current_points: string;
  live: null | boolean;
};

export type PointDistribution = {
  totalToDistribute: number;
  pointsPerWeight: number;
  distributionPerAddress: { address: Address; points: number }[];
};

type DistributionBody = {
  transfers: {
    toAddress: string;
    points: number;
  }[];
};

export const distributePoints = async (
  snapshotFilePath: string,
  outputFileSuffix: string,
) => {
  const snapshotFile = await fs.promises.readFile(snapshotFilePath, 'utf-8');
  const snapshot: PerAddressSnapshot = JSON.parse(snapshotFile);

  const allPartners: { partners: Partner[] } = await fetch(
    `${BOB_FUSION_API_URL}/partners`,
  ).then((response) => response.json());

  const singularPartner = allPartners.partners.find(
    (partner) => partner.name === 'Singular',
  );

  if (!singularPartner) {
    throw new Error('Cannot find Singular in partners list');
  }
  const totalSingularSpicePoints = parseInt(singularPartner.total_points);

  const distributableSingularPoints = totalSingularSpicePoints * 0.8; // 80% of total points

  const totalWeight = Object.values(snapshot).reduce(
    (total, { weight }) => total + weight,
    0,
  );

  const pointsPerWeight = distributableSingularPoints / totalWeight;

  const distributionPerAddress = Object.entries(snapshot).map(
    ([address, { weight }]) => ({
      address: address as Address,
      points: weight * pointsPerWeight,
    }),
  );

  const totalToDistribute = distributionPerAddress.reduce((acc, item) => {
    return acc + item.points;
  }, 0);

  const output: PointDistribution = {
    totalToDistribute,
    pointsPerWeight,
    distributionPerAddress,
  };

  const outputFilePath = `${process.cwd()}/scripts/bob-fusion/results/distribution-breakdown-${outputFileSuffix}.json`;

  await fs.promises.writeFile(outputFilePath, JSON.stringify(output, null, 2));

  const distributionRequestObject: DistributionBody = {
    transfers: distributionPerAddress.map((d) => ({
      toAddress: d.address,
      points: d.points,
    })),
  };

  const distributionResponse = await fetch(
    `${BOB_FUSION_API_URL}/distribute-points`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.BOB_FUSION_API_KEY as string,
      },
      body: JSON.stringify(distributionRequestObject),
    },
  );

  if (distributionResponse.status !== 200) {
    console.error('Failed to distribute points', {
      statusText: distributionResponse.statusText,
    });
    throw new Error('Failed to distribute points');
  }

  console.log('ALL SPICE DISTRIBUTED', {
    statusText: distributionResponse.statusText,
  });

  const snapshotTimestampsPath = `${process.cwd()}/scripts/bob-fusion/results/last-distributed.ndjson`;
  const lastDistributed: LastDistributed = {
    to: new Date().toISOString(),
    totalDistributed: totalToDistribute,
    distributionSnapshotPath: outputFilePath,
  };

  await fs.promises.appendFile(
    snapshotTimestampsPath,
    `${JSON.stringify(lastDistributed)}\n`,
  );
};
