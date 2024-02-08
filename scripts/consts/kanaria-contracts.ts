import { base, moonbaseAlpha } from 'viem/chains';

export const KANARIA_ITEMS_CONTRACTS_BASE = {
  KANPRTN: '0x20C80a3069D5b51D7d4E40764eCd905000962E57',
  EVNTS: '0xC6F7CBbb32791e0bDC737D1F360DE9C8A4a80B5F',
  KANBACK: '0xB75B0654F312d6905a075E6cDdE5501560781518',
  KANBG: '0xD45f4D4292EC351f050fA05613d7023d2eed439d',
  KANCHAMP: '0x78642bDe93E1D71087A1C3c842f9f5224d063ef1',
  KANCHEST: '0x2d09E04E626cdAf5696536A3cAb7A4cff0C8Bf71',
  KANFRNT: '0xA043F7775DA58C54dD7BAd8d1Be4BC31b3421D3a',
  KANHAND: '0x419C6D4Ae3ddE060f345FcD2d8491458C9b2e416',
  KANHEAD: '0x6362F1c01Bd7A79D51a4415f1124970aB6FA417D',
  RMRKBNNRS: '0x923C768AC53B24a188333f3709b71cB343DB20b2',
} as const;

export const KANARIA_GEMS_CONTRACTS_BASE = {
  KANGECRS2: '0x8647c92CAC59b95125D41eFc26bF24fA20d6F436',
  KANGECRS3: '0x0FcD44621752d72C9a216d8F4d986a03B8BDB03a',
  KANGECRSPRM: '0xf6E9A678a106016a675b171C3570968E941eBEdD',
  KANGEMBRGI: '0x3de0a3f3668fc891409fb82CD302DDC796542769',
  KANGEMCSHN: '0x8d340a264d9D75dBb2721583473694FC548FE61c',
  KANGEMDKK: '0x5EB0361537eA6e1E5d1938218BdE0D3fd47f3042',
  KANGEMDKKCH: '0xAA66Da11E4ae2d81806f6c61F2f402e5c67C7cAd',
  KANGEMDKKCHCH: '0x8DCE1ac4Af8E063Cc76599E571aABb7117C49b72',
  KANGEMHRMS: '0xa3ff4C47D307d95ef4B2500Bd8312Bb7fcc9C3dE',
  KANGEMKKPLL: '0xC6484A0e4865CA41d40d45e9e6059ea8f3a33Cd9',
  KANGEMNRD: '0xcd71E91cC61552F3567b0FfD6887dB7F3Fe6915f',
  KANGEMNRDS: '0x3Fef93bD412D235f3C2047c620Cf49ADAB82650C',
  KANGEMODAL: '0xbc406a8107cd4635AD0Ad2cc0C723cc5C4c9F7a5',
  KANGEVOUCH: '0x56dCEd779B142D0F59eCaD511c59F7F03F98acF2',
  KANGLVOUCH: '0xd5d3f9Ca67D2F2f5dB860EbcAb61984522937eaF',
  KANGRVOUCH: '0x45888288D054DBE4E3b0cc2577BE51F38E63F5E2',
} as const;

export const KANARIA_GEMS_CONTRACTS_MOONBASE = {
  KANGECRS2: '0xf746cbcbecdad5335cf3b7475b5639fd56f51e03',
  KANGECRS3: '0x89ed67a4ce52985e4d6bfdb9e4eac5cd9b06f9ed',
  KANGECRSPRM: '0x4feb4570e0f89c912bc0c91a7f91f17dd1409b9a',
  KANGEMBRGI: '0x9196dfab2f6d62037027182e107b4468ead533ee',
  KANGEMCSHN: '0xc3bbc1840756155c9902ed21ac0466ff59f07757',
  KANGEMDKK: '0x60578bb42dbf8d06ad8f567adab536477d61a5b6',
  KANGEMDKKCH: '0xafe4e820970ff135b4954cdf5cbb94f91b5f622c',
  KANGEMDKKCHCH: '0xa01dac701d9944438f20288b8cc57068d25570a3',
  KANGEMHRMS: '0xe43a09455db68b1699d0e425a65bba2855427ecc',
  KANGEMKKPLL: '0xacb2e0d581ee845a0019f02b758f93afe6e24593',
  KANGEMNRD: '0xc0666aa0e58def19a6e69fb5abcca6eeb5176b24',
  KANGEMNRDS: '0x4f861df23813da5a594cc0732e5d377069d2b360',
  KANGEMODAL: '0x47b16cc73a249cfc5fc0ecad21447a18f0041fea',
  KANGEVOUCH: '0xc50ddbe5a5e4cc1bb505487ce2e6e814d517b7ce',
  KANGLVOUCH: '0x66b1b6c1f495215fd308e39c522e059f0edd1226',
  KANGRVOUCH: '0x5a4916212c3343280c1460e407ad757dbbb446a7',
} as const;

export const KANARIA_ITEMS_CONTRACTS_MOONBASE = {
  KANPRTN: '0xbdb99d57dbe2ab964e9c14ce974e24ce70ad5821',
  EVNTS: '0xf9a0cc8bbb0e64c27ef5200e9fa2d457ed510c07',
  KANBACK: '0x6a3175591ab187b87d304d869f4554b81b1a3bf6',
  KANBG: '0x496f2273b92f3b42f94a121bdb3464edd1494e1c',
  KANCHAMP: '0x3607539feae9180ec359c2a0cf1fc703f47d8614',
  KANCHEST: '0xa4efd87de57f6b25d42fe6d4cd9b6ce365b030f0',
  KANFRNT: '0x5bf79e0f0441f7d13c7f70e05ff53823466f0674',
  KANHAND: '0x5ff5e180ad3d840ee6edb0618d78a6563fd5d572',
  KANHEAD: '0x2478763de97f9aa4d8a268171d27be06bae6731b',
  RMRKBNNRS: '0x180ebd26485e757d39b061e2153d13a12fe2559d',
} as const;

export const KANARIA_ITEMS_CONTRACTS = {
  [base.id]: KANARIA_ITEMS_CONTRACTS_BASE,
  [moonbaseAlpha.id]: KANARIA_ITEMS_CONTRACTS_MOONBASE,
} as const;

export const KANARIA_GEMS_CONTRACTS = {
  [base.id]: KANARIA_GEMS_CONTRACTS_BASE,
  [moonbaseAlpha.id]: KANARIA_GEMS_CONTRACTS_MOONBASE,
} as const;

export const KANARIA_BIRD_CONTRACT = {
  [base.id]: '0x011ff409BC4803eC5cFaB41c3Fd1db99fD05c004',
  [moonbaseAlpha.id]: '0x42019e0d28ec4fde639e2fd248003477b2021794',
} as const;

export const KANARIA_CATALOG_CONTRACT = {
  [base.id]: '0xDa4BA38124c77059d147939AfF239EC78a70B485',
  [moonbaseAlpha.id]: '0x15d793d00c78f243c6f97249f8d0c9699096b407',
} as const;

export const RMRK_MINTER_ADDRESS = '0xCD7A0D098E3A750126b0fec54BE401476812cfc0';
