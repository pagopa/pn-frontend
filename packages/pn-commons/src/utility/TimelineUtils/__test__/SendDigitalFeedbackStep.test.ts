import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { SERCQ_SEND_VALUE } from '../../../models/Contacts';
import {
  DigitalDomicileType,
  ResponseStatus,
  TimelineCategory,
} from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { SendDigitalFeedbackStep } from '../SendDigitalFeedbackStep';

describe('SendDigitalFeedbackStep', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('test getTimelineStepInfo with responseStatus OK - PEC', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_FEEDBACK, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      responseStatus: ResponseStatus.OK,
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalFeedbackStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-success-PEC`,
      description: `notifiche - detail.timeline.send-digital-success-PEC-description - ${JSON.stringify(
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
      label: `notifiche - detail.timeline.send-digital-success-PEC`,
      description: `notifiche - detail.timeline.send-digital-success-PEC-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo with responseStatus OK - SERCQ', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_FEEDBACK, {
      digitalAddress: {
        address: SERCQ_SEND_VALUE,
        type: DigitalDomicileType.SERCQ,
      },
      responseStatus: ResponseStatus.OK,
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalFeedbackStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-success-SERCQ-SEND`,
      description: `notifiche - detail.timeline.send-digital-success-SERCQ-SEND-description - ${JSON.stringify(
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
      label: `notifiche - detail.timeline.send-digital-success-SERCQ-SEND`,
      description: `notifiche - detail.timeline.send-digital-success-SERCQ-SEND-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: SERCQ_SEND_VALUE,
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo with responseStatus KO', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_FEEDBACK, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      responseStatus: ResponseStatus.KO,
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
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
