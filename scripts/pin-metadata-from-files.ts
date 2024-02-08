import { Metadata } from '@rmrk-team/types';
import * as fs from 'fs';
import { pinMetadata, pinToFilebase } from './utils/utils-filebase.js';
import { getMimeType } from 'stream-mime-type';
import {
  mapMimeToContentType,
  MEDIA_TYPES,
} from './utils/map-mime-type-to-content-type.js';
import invariant from 'tiny-invariant';

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

    const mediaFile = fs.createReadStream(mediaUriFilePath);
    const { mime, stream: processedStream } = await getMimeType(mediaFile);

    const mediaFileMediaType = mapMimeToContentType(mime);
    const mediaFileIsImage =
      mediaFileMediaType === MEDIA_TYPES.image ||
      mediaFileMediaType === MEDIA_TYPES.gif;


    const imageFile = fs.createReadStream(
        imageFilePath || mediaFileIsImage ? mediaUriFilePath : thumbnailFilePath,
    );
    const imageCid = await pinToFilebase(imageFile, name, bucket);
    const thumbnailCid = await pinToFilebase(fs.createReadStream(thumbnailFilePath), name, bucket);
    const mediaUriCid = await pinToFilebase(fs.createReadStream(mediaUriFilePath), name, bucket);
    const metadata = {
      ...metadataFields,
      image: `ipfs://${imageCid}`,
      thumbnail: `ipfs://${thumbnailCid}`,
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
