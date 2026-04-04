import { PFEventsType } from '../../../../models/PFEventsType';
import { ChannelType } from '../../../../models/contacts';
import type { SendAddAddressPayload } from './../shared';
import { buildSendHas } from './../shared';

export const contactCommonRegistry = {
  [PFEventsType.SEND_ADD_ADDRESS]: {
    build: ({ payload, params }: SendAddAddressPayload) => {
      const { channelType } = params;

      if (!payload || params.senderId !== 'default') {
        return {};
      }

      if (channelType === ChannelType.PEC && !payload.pecValid) {
        return {};
      }

      if (channelType === ChannelType.EMAIL) {
        return buildSendHas('SEND_HAS_EMAIL');
      }

      if (channelType === ChannelType.SMS) {
        return buildSendHas('SEND_HAS_SMS');
      }

      if (channelType === ChannelType.PEC) {
        return buildSendHas('SEND_HAS_PEC');
      }

      if (channelType === ChannelType.SERCQ_SEND) {
        return buildSendHas('SEND_HAS_SERCQ_SEND');
      }

      return {};
    },
  },
};
