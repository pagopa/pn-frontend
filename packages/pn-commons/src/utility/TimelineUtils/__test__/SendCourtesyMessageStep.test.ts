import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { DigitalDomicileType, TimelineCategory } from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { SendCourtesyMessageStep } from '../SendCourtesyMessageStep';

describe('SendCourtesyMessageStep', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it.each([
    { type: DigitalDomicileType.APPIO, expectedType: 'app IO' },
    { type: DigitalDomicileType.SMS, expectedType: 'sms' },
    { type: DigitalDomicileType.EMAIL, expectedType: 'email' },
    { type: DigitalDomicileType.TPP, expectedType: 'notifiche - detail.timeline.tpp-type' },
  ])('test getTimelineStepInfo $type', ({ type, expectedType }) => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_COURTESY_MESSAGE, {
      digitalAddress: {
        address: '',
        type,
      },
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendCourtesyMessageStep = new SendCourtesyMessageStep();
    // mono recipient
    expect(sendCourtesyMessageStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-courtesy-message`,
      description: `notifiche - detail.timeline.send-courtesy-message-description - ${JSON.stringify(
        {
          ...sendCourtesyMessageStep.nameAndTaxId(payload),
          type: expectedType,
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
          type: expectedType,
        }
      )}`,
    });
  });
});
