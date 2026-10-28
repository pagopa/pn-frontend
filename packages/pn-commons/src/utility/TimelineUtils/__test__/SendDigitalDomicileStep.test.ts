import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { SERCQ_SEND_VALUE } from '../../../models/Contacts';
import { DigitalDomicileType, TimelineCategory } from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { initLocalizationExists } from '../../localization.utility';
import { SendDigitalDomicileStep } from '../SendDigitalDomicileStep';

describe('SendDigitalDomicileStep', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('test getTimelineStepInfo without digitalAddress data', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_DOMICILE, {});
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalDomicileStep();
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual(null);
  });

  it('test getTimelineStepInfo with digitalAddress data - PEC', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_DOMICILE, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalDomicileStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-domicile-PEC`,
      description: `notifiche - detail.timeline.send-digital-domicile-PEC-description - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
    // multi recipient
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-domicile-PEC`,
      description: `notifiche - detail.timeline.send-digital-domicile-PEC-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo with digitalAddress data - SERCQ SEND', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_DOMICILE, {
      digitalAddress: {
        address: SERCQ_SEND_VALUE,
        type: DigitalDomicileType.SERCQ,
      },
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalDomicileStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND`,
      description: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND-description - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: SERCQ_SEND_VALUE,
        }
      )}`,
    });
    // multi recipient
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND`,
      description: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: SERCQ_SEND_VALUE,
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo with digitalAddress data - SERCQ SEND and new copy', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_DOMICILE, {
      digitalAddress: {
        address: SERCQ_SEND_VALUE,
        type: DigitalDomicileType.SERCQ,
      },
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
      isNewTimelineCopyEnabled: true,
    };
    const sendDigitalDomicileStep = new SendDigitalDomicileStep();
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND`,
      description: '',
    });
  });

  it('test getTimelineStepInfo with digitalAddress data - SERCQ SEND, new copy and delegate', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_DOMICILE, {
      digitalAddress: {
        address: SERCQ_SEND_VALUE,
        type: DigitalDomicileType.SERCQ,
      },
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
      isNewTimelineCopyEnabled: true,
      delegatorName: 'Test Delegator',
    };
    const sendDigitalDomicileStep = new SendDigitalDomicileStep();

    // delegate description not available (e.g. other apps)
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND`,
      description: '',
    });

    try {
      initLocalizationExists(
        (_ns, path) =>
          path === 'detail.timeline.send-digital-domicile-SERCQ-SEND-description-delegate'
      );
      // delegate
      expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
        label: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND`,
        description: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND-description-delegate - ${JSON.stringify(
          {
            ...sendDigitalDomicileStep.nameAndTaxId(payload),
            address: SERCQ_SEND_VALUE,
            recipient: 'Test Delegator',
          }
        )}`,
      });
      // direct access, mono and multi recipient
      expect(
        sendDigitalDomicileStep.getTimelineStepInfo({ ...payload, delegatorName: undefined })
      ).toStrictEqual({
        label: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND`,
        description: '',
      });
      expect(
        sendDigitalDomicileStep.getTimelineStepInfo({
          ...payload,
          delegatorName: undefined,
          isMultiRecipient: true,
        })
      ).toStrictEqual({
        label: `notifiche - detail.timeline.send-digital-domicile-SERCQ-SEND`,
        description: '',
      });
    } finally {
      initLocalizationExists(() => false);
    }
  });
});
