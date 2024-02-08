export const ItemsBatchMinter = [
  { inputs: [], name: 'RMRKNewContributorIsZeroAddress', type: 'error' },
  { inputs: [], name: 'RMRKNewOwnerIsZeroAddress', type: 'error' },
  { inputs: [], name: 'RMRKNotOwner', type: 'error' },
  { inputs: [], name: 'RMRKNotOwnerOrContributor', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'contributor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isContributor',
        type: 'bool',
      },
    ],
    name: 'ContributorUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'collection', type: 'address' },
      { internalType: 'address', name: 'toCollection', type: 'address' },
      {
        internalType: 'uint256[]',
        name: 'destinationIds',
        type: 'uint256[]',
      },
      { internalType: 'uint64', name: 'assetId', type: 'uint64' },
    ],
    name: 'batchNestMintTokensWithExistingAsset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'contributor', type: 'address' }],
    name: 'isContributor',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'contributor', type: 'address' },
      { internalType: 'bool', name: 'grantRole', type: 'bool' },
    ],
    name: 'manageContributor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
