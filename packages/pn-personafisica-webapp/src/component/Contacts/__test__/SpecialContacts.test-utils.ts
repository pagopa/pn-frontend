import { CourtesyChannelType, LegalChannelType } from "../../../models/contacts";

export const legalAddresses = [
  {
    addressType: '',
    recipientId: 'mocked-recipientId',
    senderId: 'default',
    channelType: LegalChannelType.PEC,
    value: 'mocked@mail.com',
    code: '12345',
  },
];

export const courtesyAddresses = [
  {
    addressType: '',
    recipientId: 'mocked-recipientId',
    senderId: 'default',
    channelType: CourtesyChannelType.EMAIL,
    value: 'mocked@mail.com',
    code: '12345',
  },
  {
    addressType: '',
    recipientId: 'mocked-recipientId',
    senderId: 'default',
    channelType: CourtesyChannelType.SMS,
    value: '12345678910',
    code: '12345',
  },
];

export const initialState = {
  contactsState: {
    loading: false,
    digitalAddresses: {
      legal: [],
      courtesy: [],
    },
    parties: [
      { name: 'Comune di Milano', id: 'comune-milano' },
      { name: 'Tribunale di Milano', id: 'tribunale-milano' },
    ],
  },
};
