
export const OpenseaNumericDisplayType = {
  number: 'Number',
  boost_number: 'Boost Number',
  boost_percentage: 'Boost Percentage',
};

export interface IAttribute {
  type:
    | 'array'
    | 'object'
    | 'int'
    | 'float'
    | 'number'
    | 'string'
    | 'boolean'
    | 'datetime'
    | 'royalty';
  value: any;
}

export interface IRoyaltyAttribute extends IAttribute {
  type: 'royalty';
  value: {
    receiver: string;
    royaltyPercentFloat: number;
  };
}

export declare type IProperties = Record<string, IAttribute | IRoyaltyAttribute>;

export interface Metadata {
  mediaUri?: string;
  thumbnailUri?: string;
  externalUri?: string;
  description?: string;
  name?: string;
  license?: string;
  licenseUri?: string;
  type?: string;
  locale?: string;
  attributes?: MetadataAttribute[];
  /** @deprecated deprecated in favour of `externalUri` field */
  external_url?: string;
  /** @deprecated deprecated in favour of `mediaUri` or `thumbnailUri` field */
  image?: string;
  /** @deprecated */
  image_data?: string;
  /** @deprecated deprecated in favour of `mediaUri` field */
  animation_url?: string;
  [key: string]: any;
}

export interface KusamaBasePart {
  part_id: string;
  equippable?: string[] | null;
  z: number;
  metadata?: string | null;
  type: 'slot' | 'fixed';
  src?: string | null;
}



export interface ThumbnailRemappingEntry {
  id: string;
  cid: string;
  new: string;
  original?: string;
}

export interface UpdatedCollectionMetadata {
  id: string;
  symbol: string;
  cid: string;
}

export enum DisplayType {
  null = 0,
  'boost_number' = 1,
  'number' = 2,
  'boost_percentage' = 3,
}

export interface Attribute {
  display_type: DisplayType;
  trait_type: string;
  value: number | string;
}

export const OpenseaDateDisplayType = {
  date: 'Date',
};

export const OpenseaDisplayType = { ...OpenseaNumericDisplayType, ...OpenseaDateDisplayType };

export type MetadataAttribute = {
  display_type?: keyof typeof OpenseaDisplayType | 'string' | '';
  label: string;
  type?: 'float' | 'integer' | 'string';
  value: string | number;
  trait_type: string;
};

