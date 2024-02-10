import {
  audioMimeTypes,
  media3dMimeTypes,
  videoMimeTypes,
} from './constants.js';

export const MEDIA_TYPES = {
  image: 'image',
  gif: 'gif',
  video: 'video',
  model: 'model',
  audio: 'audio',
  pdf: 'pdf',
  html: 'html',
  unknown: 'unknown',
} as const;
export type MEDIA_TYPES = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];

export const MEDIA_TYPES_ARRAY = Object.values(MEDIA_TYPES);

export const mapMimeToContentType = (mimeType?: string | null): MEDIA_TYPES => {
  if (!mimeType) return MEDIA_TYPES.unknown;

  if (mimeType.startsWith('text/html')) {
    return MEDIA_TYPES.html;
  }

  if (mimeType.startsWith('image/') && !mimeType.includes('gif')) {
    return MEDIA_TYPES.image;
  }

  if (mimeType.startsWith('image/gif')) {
    return MEDIA_TYPES.gif;
  }

  if (mimeType.startsWith('application/pdf')) {
    return MEDIA_TYPES.pdf;
  }

  if (media3dMimeTypes.includes(mimeType)) {
    return MEDIA_TYPES.model;
  }

  if (videoMimeTypes.includes(mimeType)) {
    return MEDIA_TYPES.video;
  }

  if (audioMimeTypes.includes(mimeType)) {
    return MEDIA_TYPES.audio;
  }

  return MEDIA_TYPES.unknown;
};
