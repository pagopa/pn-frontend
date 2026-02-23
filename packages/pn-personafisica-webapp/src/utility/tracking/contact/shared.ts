import { koError, mergeEvents, profile, superProperty } from '@pagopa-pn/pn-commons';

import type { DigitalAddress, SaveDigitalAddressParams } from '../../../models/contacts';

export type KoErrorPayload = Record<string, string> | undefined;

export type SendAddAddressPayload = {
  payload: DigitalAddress | void;
  params: SaveDigitalAddressParams;
};

type SendHasKey = 'SEND_HAS_EMAIL' | 'SEND_HAS_SMS' | 'SEND_HAS_PEC' | 'SEND_HAS_SERCQ_SEND';

export const buildKoError = (details: KoErrorPayload) => koError(details ?? {});

export const buildSendHas = (key: SendHasKey) =>
  mergeEvents(profile({ [key]: 'yes' }), superProperty({ [key]: 'yes' }));
