import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import { AddressType, ChannelType } from '../../../../models/contacts';
import {
  mapContactDetailsToEventPayload,
  mapDigitalDomicileToType,
} from '../contactPayloadMappers';

describe('contactPayloadMappers', () => {
  describe('mapContactDetailsToEventPayload', () => {
    it('should map default DDom, email and sms contacts', () => {
      const payload = mapContactDetailsToEventPayload(digitalAddresses);
      expect(payload).toStrictEqual({
        digital_domicile_exists: true,
        digital_domicile_type: ChannelType.PEC,
        email_exists: true,
        telephone_exists: true,
      });
    });

    it('should map empty contacts as not available', () => {
      const payload = mapContactDetailsToEventPayload([]);

      expect(payload).toStrictEqual({
        digital_domicile_exists: false,
        digital_domicile_type: 'not_available',
        email_exists: false,
        telephone_exists: false,
      });
    });

    it('should map SERCQ DDom and SMS contacts', () => {
      const payload = mapContactDetailsToEventPayload([
        {
          addressType: AddressType.LEGAL,
          channelType: ChannelType.SERCQ_SEND,
          senderId: 'default',
          value: SERCQ_SEND_VALUE,
        },
        {
          addressType: AddressType.COURTESY,
          channelType: ChannelType.SMS,
          senderId: 'default',
          value: '+39333123456',
        },
      ]);
      expect(payload).toStrictEqual({
        digital_domicile_exists: true,
        digital_domicile_type: ChannelType.SERCQ_SEND,
        email_exists: false,
        telephone_exists: true,
      });
    });

    it('should ignore invalid PEC and custom courtesy contacts', () => {
      // custom contacts and PEC in validation state
      const payload = mapContactDetailsToEventPayload([
        {
          addressType: AddressType.LEGAL,
          channelType: ChannelType.PEC,
          senderId: 'default',
          value: 'test@pec.pagopa.it',
          pecValid: false,
        },
        {
          addressType: AddressType.COURTESY,
          channelType: ChannelType.EMAIL,
          senderId: 'custom-sender',
          value: 'test@mail.pagopa.it',
        },
        {
          addressType: AddressType.COURTESY,
          channelType: ChannelType.SMS,
          senderId: 'another-custom-sender',
          value: '+39333123456',
        },
      ]);
      expect(payload).toStrictEqual({
        digital_domicile_exists: false,
        digital_domicile_type: 'not_available',
        email_exists: false,
        telephone_exists: false,
      });
    });
  });

  describe('mapDigitalDomicileToType', () => {
    it('should return not_available when no DDom exists', () => {
      expect(mapDigitalDomicileToType([])).toBe('not_available');
    });

    it('should return PEC when a valid one exists', () => {
      expect(
        mapDigitalDomicileToType([
          {
            addressType: AddressType.LEGAL,
            channelType: ChannelType.PEC,
            senderId: 'default',
            value: 'test@pec.pagopa.it',
            pecValid: true,
          },
        ])
      ).toBe(ChannelType.PEC);
    });

    it('should return not_available when PEC is not valid', () => {
      expect(
        mapDigitalDomicileToType([
          {
            addressType: AddressType.LEGAL,
            channelType: ChannelType.PEC,
            senderId: 'default',
            value: '',
            pecValid: false,
          },
        ])
      ).toBe('not_available');
    });

    it('should return SERCQ_SEND when a SERCQ DDom exists', () => {
      expect(
        mapDigitalDomicileToType([
          {
            addressType: AddressType.LEGAL,
            channelType: ChannelType.SERCQ_SEND,
            senderId: 'default',
            value: SERCQ_SEND_VALUE,
          },
        ])
      ).toBe(ChannelType.SERCQ_SEND);
    });

    it('should return SERCQ_SEND when invalid PEC and SERCQ exist', () => {
      expect(
        mapDigitalDomicileToType([
          {
            addressType: AddressType.LEGAL,
            channelType: ChannelType.PEC,
            senderId: 'default',
            value: '',
            pecValid: false,
          },
          {
            addressType: AddressType.LEGAL,
            channelType: ChannelType.SERCQ_SEND,
            senderId: 'default',
            value: SERCQ_SEND_VALUE,
          },
        ])
      ).toBe(ChannelType.SERCQ_SEND);
    });
  });
});
