import { getTimelineElem, notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { DigitalDomicileType, TimelineCategory } from '../../../types';
import { SendCourtesyMessageStep } from '../SendCourtesyMessageStep';

describe('SendCourtesyMessageStep', () => {
  it('test getTimelineStepInfo app IO', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_COURTESY_MESSAGE, {
      digitalAddress: {
        address: '',
        type: DigitalDomicileType.APPIO,
      },
    });
    const payload = {
      step: timelineElem,
      recipient: notificationToFe.recipients[0],
      isMultiRecipient: false,
    };
    const sendCourtesyMessageStep = new SendCourtesyMessageStep();
    // mono recipient
    expect(sendCourtesyMessageStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-courtesy-message`,
      description: `notifiche - detail.timeline.send-courtesy-message-description - ${JSON.stringify(
        {
          ...sendCourtesyMessageStep.nameAndTaxId(payload),
          type: 'app IO',
        }
      )}`,
    });
    // multi recipient
    expect(
      sendCourtesyMessageStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-courtesy-message`,
      description: `notifiche - detail.timeline.send-courtesy-message-description-multirecipient - ${JSON.stringify(
        {
          ...sendCourtesyMessageStep.nameAndTaxId(payload),
          type: 'app IO',
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo sms', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_COURTESY_MESSAGE, {
      digitalAddress: {
        address: '3333333333',
        type: DigitalDomicileType.SMS,
      },
    });
    const payload = {
      step: timelineElem,
      recipient: notificationToFe.recipients[0],
      isMultiRecipient: false,
    };
    const sendCourtesyMessageStep = new SendCourtesyMessageStep();
    // mono recipient
    expect(sendCourtesyMessageStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-courtesy-message`,
      description: `notifiche - detail.timeline.send-courtesy-message-description - ${JSON.stringify(
        {
          ...sendCourtesyMessageStep.nameAndTaxId(payload),
          type: 'sms',
        }
      )}`,
    });
    // multi recipient
    expect(
      sendCourtesyMessageStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-courtesy-message`,
      description: `notifiche - detail.timeline.send-courtesy-message-description-multirecipient - ${JSON.stringify(
        {
          ...sendCourtesyMessageStep.nameAndTaxId(payload),
          type: 'sms',
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo email', () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_COURTESY_MESSAGE, {
      digitalAddress: {
        address: 'nome.cognome@mail.it',
        type: DigitalDomicileType.EMAIL,
      },
    });
    const payload = {
      step: timelineElem,
      recipient: notificationToFe.recipients[0],
      isMultiRecipient: false,
    };
    const sendCourtesyMessageStep = new SendCourtesyMessageStep();
    // mono recipient
    expect(sendCourtesyMessageStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-courtesy-message`,
      description: `notifiche - detail.timeline.send-courtesy-message-description - ${JSON.stringify(
        {
          ...sendCourtesyMessageStep.nameAndTaxId(payload),
          type: 'email',
        }
      )}`,
    });
    // multi recipient
    expect(
      sendCourtesyMessageStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-courtesy-message`,
      description: `notifiche - detail.timeline.send-courtesy-message-description-multirecipient - ${JSON.stringify(
        {
          ...sendCourtesyMessageStep.nameAndTaxId(payload),
          type: 'email',
        }
      )}`,
    });
  });
});
