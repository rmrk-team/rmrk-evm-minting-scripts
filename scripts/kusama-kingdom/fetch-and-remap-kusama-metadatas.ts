import fs from 'node:fs';
import { getIpfsCidFromGatewayUrl, sanitizeIpfsUrl } from '@rmrk-team/ipfs-utils';
import { KUSAMA_API_URL_BASE } from './consts.js';
import type { KusamaDetailsItem } from './kusama-details.js';
import { mapLegacyMetadataToNewMetadata } from './map-legacy-metadata-to-new-metadata.js';

const ITEMS_PER_PAGE = 500;

type KusamaResource = {
  metadata: string;
  metadata_content_type: string | null;
  id: string;
  src: string;
};

export type KusamaNft = {
  sn: string;
  owner: string;
  metadata_name: string;
  metadata_image: string;
  metadata_description: string;
  metadata: string;
  symbol: string;
  id: string;
  collection: {
    issuer: string;
    metadata: string;
    metadata_content_type: null | string;
  };
  resources: KusamaResource[];
};

export const fetchAndRemapKusamaMetadatas = async (kusamaDetailsItem: KusamaDetailsItem) => {
  const { collectionId, namePrepend } = kusamaDetailsItem;
  const accumulatedNfts: KusamaNft[] = [];
  let hitsFound = 0;
  let page = 0;

  do {
    console.log(`fetching url: ${KUSAMA_API_URL_BASE}/${collectionId}/${page * ITEMS_PER_PAGE}`);
    const response = await fetch(`${KUSAMA_API_URL_BASE}/${collectionId}/${page * ITEMS_PER_PAGE}`);
    const { nfts } = (await response.json()) as { nfts: KusamaNft[] };
    console.log('nfts', nfts);
    hitsFound = nfts.length;
    page++;

    accumulatedNfts.push(...nfts);
  } while (hitsFound >= ITEMS_PER_PAGE);

  const nftsWithMetadata: KusamaNft[] = [];

  for (const nft of accumulatedNfts) {
    if (nft.resources.length === 0) {
      const ipfsCid = getIpfsCidFromGatewayUrl(nft.metadata);

      const uri = ipfsCid
        ? sanitizeIpfsUrl(`ipfs://${ipfsCid}`, 'https://ipfs2.rmrk.link')
        : undefined;
      if (!uri) {
        throw new Error(`Could not get IPFS CID from ${nft.metadata}`);
      }
      const metadata = await fetch(uri);
      const metadataJson = await metadata.json();
      nftsWithMetadata.push({
        ...nft,
        metadata_image: metadataJson?.image || metadataJson?.mediaUri,
        metadata_description: metadataJson?.description,
        metadata_name: metadataJson?.name,
        resources: [
          {
            src: metadataJson?.image || metadataJson?.mediaUri,
            metadata: uri,
            metadata_content_type: null,
            id: '0',
          },
        ],
      });
    } else {
      nftsWithMetadata.push(nft);
    }
  }

  const metadatas = nftsWithMetadata.map((kusamaNft) =>
    mapLegacyMetadataToNewMetadata({ kusamaNft, namePrepend }),
  );

  const outputPath = `${process.cwd()}/scripts/kusama-kingdom/kusama-kingdom-metadata/${collectionId}`;

  const dirExists = fs.existsSync(outputPath);
  if (!dirExists) {
    fs.mkdirSync(outputPath);
  }

  for (const [index, metadata] of metadatas.entries()) {
    console.log(metadata);

    await fs.promises.writeFile(
      `${outputPath}/${index + 1}.json`,
      JSON.stringify(metadata, null, 2),
    );
  }
};
