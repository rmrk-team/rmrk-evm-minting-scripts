import type { Address } from 'viem';
import { base, baseSepolia, bob, moonbaseAlpha } from 'viem/chains';

export const ITEM_BATCH_MINTER_ADDRESS = {
  [base.id]: '0xE35C74da0918Bf58Ac61bA3fF2F84EB877909695',
  [moonbaseAlpha.id]: '0x1042aC95C399E429328Fb9591c9c6828B0fF747A',
} as const;

export const RMRK_REGISTRY = {
  [bob.id]: '0x415aEcB40E26Cda3D3Db8b475F56198A994501ea',
  [baseSepolia.id]: '0xAB79599164Df5E354eeDDf8B07eC215D3aBf3FAc',
} as const;

export const HashZero = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const unlimitedMaxSupply = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);
export const Erc721Lego = 5;

export const DEFAULT_REGISTRY_CONFIG = {
  usesOwnable: true,
  usesAccessControl: false,
  usesRMRKContributor: false,
  usesRMRKMintingUtils: false,
  usesRMRKLockable: true,
  hasStandardAssetManagement: false,
  hasStandardMinting: false,
  hasStandardNestMinting: false,
  autoAcceptsFirstAsset: false,
  customLegoCombination: 0,
  customMintingType: 0,
  adminRole: HashZero as Address,
};
