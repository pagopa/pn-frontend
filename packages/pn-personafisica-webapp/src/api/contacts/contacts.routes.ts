import {
  compileRoute,
} from '@pagopa-pn/pn-commons';

import { LegalChannelType, CourtesyChannelType } from '../../models/contacts';

// Prefixes
const API_CONTACTS_PREFIX = 'address-book';

// Segments
const API_VERSION_SEGMENT = 'v1';
const API_CONTACTS_BASE = 'digital-address';
const API_CONTACTS_LEGAL = 'legal';
const API_CONTACTS_COURTESY = 'courtesy';

// Parameters
const API_CONTACTS_SENDER_ID_PARAMETER = 'senderId';
const API_CONTACTS_CHANNEL_TYPE_PARAMETER = 'channelType';

// Paths
const API_CONTACTS_BASE_PATH = `${API_VERSION_SEGMENT}/${API_CONTACTS_BASE}`;
const API_CONTACTS_LEGAL_PATH = `${API_VERSION_SEGMENT}/${API_CONTACTS_BASE}/${API_CONTACTS_LEGAL}/:${API_CONTACTS_SENDER_ID_PARAMETER}/:${API_CONTACTS_CHANNEL_TYPE_PARAMETER}`;
const API_CONTACTS_COURTESY_PATH = `${API_VERSION_SEGMENT}/${API_CONTACTS_BASE}/${API_CONTACTS_COURTESY}/:${API_CONTACTS_SENDER_ID_PARAMETER}/:${API_CONTACTS_CHANNEL_TYPE_PARAMETER}`;

// APIs
export function CONTACTS_LIST() {
  return compileRoute({
    prefix: API_CONTACTS_PREFIX,
    path: API_CONTACTS_BASE_PATH
  });
}

export function LEGAL_CONTACT(senderId: string, channelType: LegalChannelType) {
  return compileRoute({
    prefix: API_CONTACTS_PREFIX,
    path: API_CONTACTS_LEGAL_PATH,
    params: {
      [API_CONTACTS_SENDER_ID_PARAMETER]: senderId,
      [API_CONTACTS_CHANNEL_TYPE_PARAMETER]: channelType
    }
  });
}

export function COURTESY_CONTACT(senderId: string, channelType: CourtesyChannelType) {
  return compileRoute({
    prefix: API_CONTACTS_PREFIX,
    path: API_CONTACTS_COURTESY_PATH,
    params: {
      [API_CONTACTS_SENDER_ID_PARAMETER]: senderId,
      [API_CONTACTS_CHANNEL_TYPE_PARAMETER]: channelType
    }
  });
}

