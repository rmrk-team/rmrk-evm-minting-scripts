import { Metadata } from '@rmrk-team/types';
import * as fs from 'fs';
import { pinMetadata, pinToFilebase } from './utils/utils-filebase.js';
import {
  mapMimeToContentType,
  MEDIA_TYPES,
} from './utils/map-mime-type-to-content-type.js';
import invariant from 'tiny-invariant';
import mime from 'mime-types';

export type InputData = {
  metadataFields: Metadata;
  imageFilePath?: string;
  thumbnailFilePath: string;
  mediaUriFilePath: string;
};

export const pinMetadataFromFiles = async (
  inputDataArray: InputData[],
  outputLogFilePath: string,
  bucket?: string,
) => {
  const outputLog: Record<string, string> = {};

  for (const inputData of inputDataArray) {
    const {
      metadataFields,
      imageFilePath,
      thumbnailFilePath,
      mediaUriFilePath,
    } = inputData;

    const name = metadataFields.name;

    if (
      imageFilePath?.startsWith('ipfs://') ||
      thumbnailFilePath.startsWith('ipfs://') ||
      mediaUriFilePath.startsWith('ipfs://')
    ) {
      throw new Error('This function expects local paths to media files');
    }

    invariant(name, 'Name is required');
    const mediaFileName = mediaUriFilePath.split('/').pop();
    invariant(mediaFileName);
    const mimeType = mime.lookup(mediaFileName) || undefined;

    const mediaFileMediaType = mapMimeToContentType(mimeType);
    const mediaFileIsImage =
      mediaFileMediaType === MEDIA_TYPES.image ||
      mediaFileMediaType === MEDIA_TYPES.gif;

    const imageCid = await pinToFilebase(
      imageFilePath || mediaFileIsImage ? mediaUriFilePath : thumbnailFilePath,
      name,
      bucket,
    );
    const thumbnailCid = await pinToFilebase(thumbnailFilePath, name, bucket);

    const mediaUriCid = await pinToFilebase(mediaUriFilePath, name, bucket);
    const metadata: Metadata = {
      ...metadataFields,
      image: `ipfs://${imageCid}`,
      thumbnailUri: `ipfs://${thumbnailCid}`,
      mediaUri: `ipfs://${mediaUriCid}`,
    };

    if (!mediaFileIsImage) {
      metadata.animation_url = `ipfs://${mediaUriCid}`;
    }
    const metadataCidResult = await pinMetadata(metadata, bucket);
    console.log(
      `Metadata for ${name} pinned to IPFS with CID: ${metadataCidResult}`,
    );

    outputLog[name] = `ipfs://${metadataCidResult}`;
  }

  console.log('Finished pinning');

  await fs.promises.writeFile(
    outputLogFilePath,
    JSON.stringify(outputLog, null, 2),
  );
};
