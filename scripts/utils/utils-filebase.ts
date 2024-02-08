import 'dotenv/config';
import { File, FilebaseClient } from '@filebase/client';
import { Readable } from 'stream';
import streamToBlob from './stream-to-blob.js';
import { getMimeType } from 'stream-mime-type';
import { Metadata } from '@rmrk-team/types';

const FILEBASE_CONFIG = {
  key: process.env.FILEBASE_KEY,
  secret: process.env.FILEBASE_SECRET,
  bucket: process.env.FILEBASE_BUCKET,
};

const getFilebaseToken = (bucket = FILEBASE_CONFIG.bucket) => {
  return Buffer.from(
    `${FILEBASE_CONFIG.key}:${FILEBASE_CONFIG.secret}:${bucket}`,
  ).toString('base64');
};

export const pinToFilebase = async (
  stream: Readable,
  name?: string,
  bucket?: string,
): Promise<string> => {
  const { mime, stream: processedStream } = await getMimeType(stream);
  const blob = await streamToBlob(processedStream, mime);
  return await FilebaseClient.storeBlob(
    {
      endpoint: 'https://s3.filebase.com',
      token: getFilebaseToken(bucket),
    },
    blob,
    `${name}_hardhat_test`,
  );
};

export const pinBlobToFilebase = async (
  blob: Blob,
  name?: string,
  bucket?: string,
): Promise<string> => {
  return await FilebaseClient.storeBlob(
    {
      endpoint: 'https://s3.filebase.com',
      token: getFilebaseToken(bucket),
    },
    blob,
    `${name}_hardhat_test`,
  );
};

export const pinMetadata = async (
  metadata: Metadata,
  bucket?: string,
): Promise<string> => {
  const id = 'hardhat_test';
  return await FilebaseClient.storeBlob(
    {
      endpoint: 'https://s3.filebase.com',
      token: getFilebaseToken(bucket),
    },
    new File(
      [JSON.stringify(metadata, null, 2)],
      `${metadata?.name || ''}_${id}.json`,
    ),
    `${metadata?.name || ''}_${id}.json`,
  );
};
