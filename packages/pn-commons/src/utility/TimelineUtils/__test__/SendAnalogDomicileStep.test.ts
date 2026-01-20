import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { PhysicalCommunicationType, TimelineCategory } from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { SendAnalogDomicileStep } from '../SendAnalogDomicileStep';

const physicalAddress = {
  at: '',
  addressDetails: '',
  address: 'Via Mazzini 1848',
  zip: '98036',
  municipality: 'Graniti',
  province: '',
  foreignState: 'Italy',
};

describe('SendAnalogDomicileStep', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('test getTimelineStepInfo with serviceLevel REGISTERED_LETTER_890', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_DOMICILE, {
      serviceLevel: PhysicalCommunicationType.REGISTERED_LETTER_890,
      physicalAddress,
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendAnalogDomicileStep = new SendAnalogDomicileStep();
    // mono recipient
    expect(sendAnalogDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-analog-domicile-890`,
      description: `notifiche - detail.timeline.send-analog-domicile-890-description - ${JSON.stringify(
        {
          ...sendAnalogDomicileStep.nameAndTaxId(payload),
          ...sendAnalogDomicileStep.completePhysicalAddressFromStep(payload.step),
        }
      )}`,
    });
    // multi recipient
    expect(
      sendAnalogDomicileStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-analog-domicile-890`,
      description: `notifiche - detail.timeline.send-analog-domicile-890-description-multirecipient - ${JSON.stringify(
        {
          ...sendAnalogDomicileStep.nameAndTaxId(payload),
          ...sendAnalogDomicileStep.completePhysicalAddressFromStep(payload.step),
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo with different serviceLevel', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_DOMICILE, {
      serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
      physicalAddress,
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendAnalogDomicileStep = new SendAnalogDomicileStep();
    // mono recipient
    expect(sendAnalogDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-analog-domicile-ar`,
      description: `notifiche - detail.timeline.send-analog-domicile-ar-description - ${JSON.stringify(
        {
          ...sendAnalogDomicileStep.nameAndTaxId(payload),
          ...sendAnalogDomicileStep.completePhysicalAddressFromStep(payload.step),
        }
      )}`,
    });
    // multi recipient
    expect(
      sendAnalogDomicileStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-analog-domicile-ar`,
      description: `notifiche - detail.timeline.send-analog-domicile-ar-description-multirecipient - ${JSON.stringify(
        {
          ...sendAnalogDomicileStep.nameAndTaxId(payload),
          ...sendAnalogDomicileStep.completePhysicalAddressFromStep(payload.step),
        }
      )}`,
    });
  });
});
