export const KUSAMA_KINGDOM_KUSAMA_DETAILS = {
  '2644199cf3652aaa78-KQ01': {
    collectionId: '2644199cf3652aaa78-KQ01',
    collectionMetadataFields: {
      name: 'Kingdom Ventures [Queens]',
      description:
        'There are 110 Queens in total [60 Limited, 25 Rare, 15 Ultra Rare and 10 Legendaries] each unique. All Queen holders are granted exclusive access to [The Great Hall](https://discord.gg/Wu5u69mx) a private discord for NFT holders which also gives access to various investments not open to the public. Long Live the Queens',
    },
    namePrepend: 'Queen',
    maxSupply: 110,
  },
  '2644199cf3652aaa78-KK01': {
    collectionId: '2644199cf3652aaa78-KK01',
    collectionMetadataFields: {
      name: 'Kingdom Ventures [Kings]',
      description:
        'There are 110 Kings in total [60 Limited, 25 Rare, 15 Ultra Rare and 10 Legendaries] each unique. All King holders are granted exclusive access to [The Great Hall](https://discord.gg/Wu5u69mx) a private discord for NFT holders which also gives access to various investments not open to the public. Pays to be a King',
    },
    namePrepend: 'King',
    maxSupply: 110,
  },
  '2644199cf3652aaa78-KK03': {
    collectionId: '2644199cf3652aaa78-KK03',
    collectionMetadataFields: {
      name: 'Legend Of The Lost Swords',
      description:
        'Legend has it that there once existed ten legendary swords, each possessing powers that only a Legendary Kusama King could wield. Great battles of old were fought with the swords and lands were conquered in both the living world and the dead. Now, lost to the ages, these swords have not been seen in many centuries, Still to this day each sword calls out to its Legendary King, and he is draw to its aura. It is now down to you to recover these swords by assembling an army that brings Kings from across the land together to assist each Legendary King in his quest.',
    },
    namePrepend: 'Sword',
    maxSupply: 10,
  },
  '2644199cf3652aaa78-FROG': {
    collectionId: '2644199cf3652aaa78-FROG',
    collectionMetadataFields: {
      name: 'The Mystery of the Cursed Frogs',
      description:
        'History tells of 10 Princes, the sons of the 10 Legendary Queens put under a spell by an evil witch and transformed into Frogs for the rest of time. Disgusted with their new form, the Princes ran away and the Queens have been looking for them ever since! The Queens are desperate to find their missing sons and will need the assistance of other Queens to complete their Quest. By holding a Queen of each rarity you will be able to claim the respective Frog for your legendary Queen.',
    },
    namePrepend: 'Frog',
    maxSupply: 10,
  },
  '2644199cf3652aaa78-KKB1': {
    collectionId: '2644199cf3652aaa78-KKB1',
    collectionMetadataFields: {
      name: 'Kingdom Ventures [Babies]',
      description:
        'The Royal Babies of Kingdom Ventures are granted to holders who claimed and burnt a Wedding Ring Each are custom based on the genetics of the King and Queen',
    },
    namePrepend: 'Baby',
    maxSupply: 30,
  },
  '2644199cf3652aaa78-WR00': {
    collectionId: '2644199cf3652aaa78-WR00',
    collectionMetadataFields: {
      name: 'Kingdom Ventures Wedding Rings',
      description:
        'The Royal Rings of Kingdom Ventures. These Rings are available to holders of both a King and Queen NFT. They can be claimed in The Chapel and then redeemed for a custom Kingdom Baby Only 50 will ever exist!',
    },
    namePrepend: 'Ring',
    maxSupply: 20,
  },
} as const;

export type KusamaDetailsItem =
  (typeof KUSAMA_KINGDOM_KUSAMA_DETAILS)[keyof typeof KUSAMA_KINGDOM_KUSAMA_DETAILS];
