import { getTimelineElem, notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { DigitalDomicileType, TimelineCategory } from '../../../models';
import { initLocalizationForTest } from '../../../test-utils';
import { SendDigitalFeedbackStep } from '../SendDigitalFeedbackStep';

describe('SendDigitalFeedbackStep', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('test getTimelineStepInfo with responseStatus OK', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_FEEDBACK, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      responseStatus: 'OK',
    });
    const payload = {
      step: timelineElem,
      recipient: notificationToFe.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalFeedbackStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-success`,
      description: `notifiche - detail.timeline.send-digital-success-description - ${JSON.stringify(
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
      label: `notifiche - detail.timeline.send-digital-success`,
      description: `notifiche - detail.timeline.send-digital-success-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo with responseStatus KO', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_FEEDBACK, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      responseStatus: 'KO',
    });
    const payload = {
      step: timelineElem,
      recipient: notificationToFe.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalFeedbackStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-error`,
      description: `notifiche - detail.timeline.send-digital-error-description - ${JSON.stringify({
        ...sendDigitalDomicileStep.nameAndTaxId(payload),
        address: 'nome.cognome@pec.it',
      })}`,
    });
    // multi recipient
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-error`,
      description: `notifiche - detail.timeline.send-digital-error-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
  });
});
