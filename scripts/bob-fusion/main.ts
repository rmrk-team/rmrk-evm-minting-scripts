import { getEligibleInteractionsSnapshot } from './get-eligible-interactions-snapshot.js';
import { sumPointsFromSnapshot } from './sum-points-from-snapshot.js';
import { distributePoints } from './distribute-points.js';

const main = async () => {
  const { logFilePath: snapshotTimestampsPath, outputFileSuffix } =
    await getEligibleInteractionsSnapshot();
  const { outputFilePath: summedSnapshotFilePath } =
    await sumPointsFromSnapshot(snapshotTimestampsPath, outputFileSuffix);
  await distributePoints(summedSnapshotFilePath, outputFileSuffix);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
