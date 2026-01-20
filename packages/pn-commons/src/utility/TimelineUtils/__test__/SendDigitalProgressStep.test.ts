import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { DigitalDomicileType, TimelineCategory } from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { SendDigitalProgressStep } from '../SendDigitalProgressStep';

describe('SendDigitalProgressStep', () => {
  const errorDeliveryCodes = ['C008', 'C010', 'DP10'];
  const successDeliveryCodes = ['C001', 'DP00'];

  beforeAll(() => {
    initLocalizationForTest();
  });

  it.each(errorDeliveryCodes)(`test getTimelineStepInfo with deliveryDetailCode %s`, (code) => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_PROGRESS, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      deliveryDetailCode: code,
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalProgressStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-progress-error`,
      description: `notifiche - detail.timeline.send-digital-progress-error-description - ${JSON.stringify(
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
      label: `notifiche - detail.timeline.send-digital-progress-error`,
      description: `notifiche - detail.timeline.send-digital-progress-error-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
  });

  it.each(successDeliveryCodes)(`test getTimelineStepInfo with deliveryDetailCode %s`, (code) => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_PROGRESS, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      deliveryDetailCode: code,
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalProgressStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-progress-success`,
      description: `notifiche - detail.timeline.send-digital-progress-success-description - ${JSON.stringify(
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
      label: `notifiche - detail.timeline.send-digital-progress-success`,
      description: `notifiche - detail.timeline.send-digital-progress-success-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
  });

  it(`test getTimelineStepInfo with unhandled deliveryDetailCode`, () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_PROGRESS, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      deliveryDetailCode: 'INVCD',
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalProgressStep();
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual(null);
  });
});
