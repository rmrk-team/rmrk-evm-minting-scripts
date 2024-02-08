// from https://github.com/feross/stream-to-blob but with better types
import { Blob } from '@filebase/client';

function streamToBlob(stream: NodeJS.ReadableStream, mimeType: string): Promise<Blob> {
  if (mimeType != null && typeof mimeType !== 'string') {
    throw new Error('Invalid mimetype, expected string.');
  }
  return new Promise((resolve, reject) => {
    const chunks: BlobPart[] = [];
    stream
      .on('data', (chunk: BlobPart) => chunks.push(chunk))
      .once('end', () => {
        const blob = mimeType != null ? new Blob(chunks, { type: mimeType }) : new Blob(chunks);
        resolve(blob);
      })
      .once('error', reject);
  });
}

export default streamToBlob;
