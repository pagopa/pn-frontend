import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { DigitalDomicileType, TimelineCategory } from '../../../models';
import { initLocalizationForTest } from '../../../test-utils';
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

  it('test getTimelineStepInfo with digitalAddress data', () => {
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
      label: `notifiche - detail.timeline.send-digital-domicile`,
      description: `notifiche - detail.timeline.send-digital-domicile-description - ${JSON.stringify(
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
      label: `notifiche - detail.timeline.send-digital-domicile`,
      description: `notifiche - detail.timeline.send-digital-domicile-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
  });
});
