import { deploy } from './deploy.js';
// import { fetchAndRemapKusamaMetadatas } from './fetch-and-remap-kusama-metadatas.js';
// import { KUSAMA_KINGDOM_KUSAMA_DETAILS } from './kusama-details.js';

const runScript = async () => {
  console.log('Running script...');

  // for (const id of Object.keys(KUSAMA_KINGDOM_KUSAMA_DETAILS)) {
  //   // @ts-ignore
  //   await fetchAndRemapKusamaMetadatas(KUSAMA_KINGDOM_KUSAMA_DETAILS[id]);
  // }

  await deploy();
};

runScript().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
