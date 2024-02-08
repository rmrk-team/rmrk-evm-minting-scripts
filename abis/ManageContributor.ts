export const ManageContributor = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contributor',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'grantRole',
        type: 'bool',
      },
    ],
    name: 'manageContributor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
