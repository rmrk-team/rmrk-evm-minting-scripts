// import { isEmpty, mergeRight, reject } from 'ramda';

import type { KusamaNft } from './fetch-and-remap-kusama-metadatas.js';
import type { Metadata } from './types/types.js';

// export function mergeMetadatas(
//   nftMetadataProp: Metadata | null | undefined,
//   resource: NftDbResponseResource | null | undefined,
//   resourceMetadata: Metadata | null | undefined,
// ) {
//   const nftMetadata = nftMetadataProp || {};
//   const resourceFields = {
//     thumbnailUri: resource?.thumb || '',
//     mediaUri: resource?.src || '',
//   };
//
//   const mergedResourceMetadata = mergeRight(
//     resourceMetadata || {},
//     reject(isEmpty, resourceFields || {}),
//   );
//
//   return mergeRight(reject(isEmpty, nftMetadata || {}), mergedResourceMetadata);
// }

// export const getPrimaryMediaForAsset = ({
//   nftMetadata,
//   resource,
//   resourceMetadata,
// }: {
//   resource?: NftDbResponseResource;
//   nftMetadata?: Metadata;
//   resourceMetadata?: Metadata;
// }) => {
//   const mergedMetadata = mergeMetadatas(nftMetadata, resource, resourceMetadata);
//   return mergedMetadata.mediaUri || mergedMetadata.image;
// };

const attributes = {
  Limited: [
    {
      display_type: 'string',
      trait_type: 'Rarity',
      value: 'Limited',
    },
  ],
  Rare: [
    {
      display_type: 'string',
      trait_type: 'Rarity',
      value: 'Rare',
    },
  ],
  'Ultra Rare': [
    {
      display_type: 'string',
      trait_type: 'Rarity',
      value: 'Ultra Rare',
    },
  ],
  Legendary: [
    {
      display_type: 'string',
      trait_type: 'Rarity',
      value: 'Legendary',
    },
  ],
};

const getAttributes = (description: string) => {
  switch (true) {
    case description.includes('Limited'):
      return attributes['Limited'];
    case description.includes('Rare') && !description.includes('Ultra Rare'):
      return attributes['Rare'];
    case description.includes('Ultra Rare'):
      return attributes['Ultra Rare'];
    case description.includes('Legendary'):
      return attributes['Legendary'];
    default:
      return undefined;
  }
};

type Props = {
  kusamaNft: KusamaNft;
  namePrepend?: string;
};

/**
 * This function maps legacy metadata to new metadata
 * pass Asset id if remapping metadata for the asset
 * isPrimaryMediaAnImage should be a boolean if mime type is of type image on media that you get through getPrimaryMediaForAsset
 * @param nftMetadata - nft metadata JSON
 * @param isPrimaryMediaAnImage - boolean if getPrimaryMediaForAsset media is of type image
 * @param resource - resource, only used for src and thumb fields as for Kanaria these sometimes use more correct values VS metadata JSON
 * @param resourceMetadata - metadata JSON for the asset
 * @param kusamaNftId - Kusama NFT id
 */
export const mapLegacyMetadataToNewMetadata = ({ kusamaNft, namePrepend }: Props) => {
  const { metadata_image, metadata_description, metadata_name, resources } = kusamaNft;

  const primaryAsset =
    resources.find((resource) => resource.metadata_content_type === 'gif') || resources[0];
  const thumbnailAsset =
    resources.length > 1
      ? resources.find((resource) => resource.metadata_content_type !== 'gif')
      : undefined;

  const isPrimaryAssetAnimated = primaryAsset?.metadata_content_type === 'gif';

  let imageUri =
    !isPrimaryAssetAnimated || (primaryAsset && !thumbnailAsset)
      ? primaryAsset.src
      : thumbnailAsset
        ? thumbnailAsset?.src
        : metadata_image;
  imageUri = imageUri?.replace('ipfs://ipfs/', 'ipfs://');

  const animationUri =
    isPrimaryAssetAnimated && thumbnailAsset
      ? primaryAsset?.src?.replace('ipfs://ipfs/', 'ipfs://')
      : undefined;

  //
  // const mergedMetadata = mergeMetadatas(
  //   isAttributesRequired ? nftMetadata : otherNftMetadataFields,
  //   resource,
  //   resourceMetadata,
  // );

  const newMetadata: Metadata = {
    image: imageUri,
    animation_url: animationUri,
    external_url: 'https://discord.gg/cyQaS3vsKf',
    name: `${namePrepend ?? ''}${namePrepend ? ' ' : ''}${metadata_name.trimEnd()}`,
    description: metadata_description.trimEnd(),
    //@ts-ignore
    attributes: getAttributes(metadata_description),
  };

  return newMetadata;
};
