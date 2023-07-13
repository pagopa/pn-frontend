import { CourtesyChannelType, IOAllowedValues, LegalChannelType } from '../../models/contacts';

const userState = {
  user: {
    uid: 'mocked-recipientId',
    organization: {
      name: 'Mocked organization',
    },
  },
};

const appIo = {
  addressType: 'COURTESY',
  recipientId: 'mocked-recipient-id',
  senderId: 'default',
  senderName: null,
  channelType: CourtesyChannelType.IOMSG,
  value: IOAllowedValues.DISABLED,
};

const legal = [
  {
    addressType: 'LEGAL',
    recipientId: 'mocked-recipient-id',
    senderId: 'default',
    senderName: null,
    channelType: 'PEC',
    value: 'aaa@aaa.com',
    requestId: null,
    codeValid: true,
    pecValid: true,
  },
];

const courtesy = [
  {
    addressType: 'COURTESY',
    recipientId: 'mocked-recipient-id',
    senderId: 'default',
    senderName: null,
    channelType: 'EMAIL',
    value: 'ada@maila.it',
  },
  {
    addressType: 'COURTESY',
    recipientId: 'mocked-recipient-id',
    senderId: 'default',
    senderName: null,
    channelType: 'SMS',
    value: '+39320000001',
  },
];

export const contactsAppIoOnly = {
  preloadedState: {
    userState,
    contactsState: {
      digitalAddresses: {
        legal: [],
        courtesy: [appIo],
      },
    },
  },
};

export const contactsLegalOnly = {
  preloadedState: {
    userState,
    contactsState: {
      digitalAddresses: {
        legal,
        courtesy: [],
      },
    },
  },
};

export const contactsCourtesyOnly = {
  preloadedState: {
    userState,
    contactsState: {
      digitalAddresses: {
        legal: [],
        courtesy,
      },
    },
  },
};

export const contactsCourtesyOnlyWithAppIo = {
  preloadedState: {
    userState,
    contactsState: {
      digitalAddresses: {
        legal: [],
        courtesy: [...courtesy, { ...appIo }],
      },
    },
  },
};

export const contactsFull = {
  preloadedState: {
    userState,
    contactsState: {
      digitalAddresses: {
        legal,
        courtesy,
      },
    },
  },
};
