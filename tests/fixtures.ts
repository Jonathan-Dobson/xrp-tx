import { Wallet } from 'xrpl';

const testWallet = Wallet.generate();
const destinationWallet = Wallet.generate();

/**
 * Valid field sets for every transaction type supported by xrplt.
 * These are used to verify that the library can generate valid JSON
 * that xrpl.js can then encode and sign.
 */
export const TransactionFixtures: Record<string, Record<string, any>> = {
  // --- Account Management ---
  AccountSet: {
    Account: testWallet.address,
    Domain: '6578616D706C652E636F6D', // hex for "example.com"
    SetFlag: 8, // asfReceiveAMM
  },
  AccountDelete: {
    Account: testWallet.address,
    Destination: destinationWallet.address,
    DestinationTag: 123,
  },
  SetRegularKey: {
    Account: testWallet.address,
    RegularKey: destinationWallet.address,
  },
  SignerListSet: {
    Account: testWallet.address,
    SignerQuorum: 1,
    SignerEntries: [
      {
        SignerEntry: {
          Account: destinationWallet.address,
          SignerWeight: 1,
        },
      },
    ],
  },
  DepositPreauth: {
    Account: testWallet.address,
    Authorize: destinationWallet.address,
  },
  TicketCreate: {
    Account: testWallet.address,
    TicketCount: 5,
  },
  Clawback: {
    Account: testWallet.address,
    Amount: {
      currency: 'USD',
      issuer: destinationWallet.address, // Holder address in xrpl.js v3 logic?
      value: '100',
    },
  },

  // --- Payments ---
  Payment: {
    Account: testWallet.address,
    Destination: destinationWallet.address,
    Amount: '1000000',
  },
  CheckCreate: {
    Account: testWallet.address,
    Destination: destinationWallet.address,
    SendMax: '10000000',
    Expiration: 970112000,
  },
  CheckCash: {
    Account: testWallet.address,
    CheckID: '4962646261626261626261626261626261626261626261626261626261626261',
    Amount: '1000000',
  },
  CheckCancel: {
    Account: testWallet.address,
    CheckID: '4962646261626261626261626261626261626261626261626261626261626261',
  },
  EscrowCreate: {
    Account: testWallet.address,
    Destination: destinationWallet.address,
    Amount: '1000000',
    FinishAfter: 970112000,
  },
  EscrowFinish: {
    Account: testWallet.address,
    Owner: testWallet.address,
    OfferSequence: 1,
  },
  EscrowCancel: {
    Account: testWallet.address,
    Owner: testWallet.address,
    OfferSequence: 1,
  },
  TrustSet: {
    Account: testWallet.address,
    LimitAmount: {
      currency: 'USD',
      issuer: destinationWallet.address,
      value: '1000',
    },
  },

  // --- NFT ---
  NFTokenMint: {
    Account: testWallet.address,
    NFTokenTaxon: 0,
    URI: '697066733A2F2F62616679626569676479727361653762636E737664646A7A6D72637963626A666D3334666362677232326775653572336369656463326F6D636A69',
  },
  NFTokenBurn: {
    Account: testWallet.address,
    NFTokenID: '00080000D36D560611E649F5F58E783688172824C1656E690000099B00000000',
  },
  NFTokenCreateOffer: {
    Account: testWallet.address,
    NFTokenID: '00080000D36D560611E649F5F58E783688172824C1656E690000099B00000000',
    Amount: '1000000',
    Owner: destinationWallet.address, // Required for buy offers
  },

  // --- AMM ---
  AMMCreate: {
    Account: testWallet.address,
    Amount: '1000000',
    Amount2: {
      currency: 'USD',
      issuer: destinationWallet.address,
      value: '1000',
    },
    TradingFee: 500,
  },
  AMMDeposit: {
    Account: testWallet.address,
    Asset: {
      currency: 'XRP',
    },
    Asset2: {
      currency: 'USD',
      issuer: destinationWallet.address,
    },
    Amount: '1000000',
  },

  // --- XChain ---
  XChainCreateBridge: {
    Account: testWallet.address,
    XChainBridge: {
      IssuingChainDoor: testWallet.address,
      IssuingChainIssue: { currency: 'XRP' },
      LockingChainDoor: destinationWallet.address,
      LockingChainIssue: { currency: 'XRP' },
    },
    SignatureReward: '100',
    MinAccountCreateAmount: '1000000',
  },
  XChainCommit: {
    Account: testWallet.address,
    XChainBridge: {
      IssuingChainDoor: testWallet.address,
      IssuingChainIssue: { currency: 'XRP' },
      LockingChainDoor: destinationWallet.address,
      LockingChainIssue: { currency: 'XRP' },
    },
    XChainClaimID: '1',
    Amount: '1000000',
  },

  // --- MPT ---
  MPTokenIssuanceCreate: {
    Account: testWallet.address,
    AssetScale: 6,
    TransferFee: 100,
    Flags: 32, // tfMPTCanTransfer
  },
};
