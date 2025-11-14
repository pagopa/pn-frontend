import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { TimelineCategory } from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { SendSimpleRegisteredLetterStep } from '../SendSimpleRegisteredLetterStep';

const physicalAddress = {
  at: '',
  addressDetails: '',
  address: 'Via Mazzini 1848',
  zip: '98036',
  municipality: 'Graniti',
  province: '',
  foreignState: 'Italy',
};

const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_PROGRESS, {
  physicalAddress,
});

const payload = {
  step: timelineElem,
  recipient: notificationDTO.recipients[0],
  isMultiRecipient: false,
};

describe('SendSimpleRegisteredLetterStep', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('test getTimelineStepInfo', () => {
    const sendSimpleRegisteredLetterStep = new SendSimpleRegisteredLetterStep();
    // mono recipient
    expect(sendSimpleRegisteredLetterStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-simple-registered-letter`,
      description: `notifiche - detail.timeline.send-simple-registered-letter-description - ${JSON.stringify(
        {
          ...sendSimpleRegisteredLetterStep.nameAndTaxId(payload),
          ...sendSimpleRegisteredLetterStep.completePhysicalAddressFromStep(payload.step),
        }
      )}`,
    });
    // multi recipient
    expect(
      sendSimpleRegisteredLetterStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-simple-registered-letter`,
      description: `notifiche - detail.timeline.send-simple-registered-letter-description-multirecipient - ${JSON.stringify(
        {
          ...sendSimpleRegisteredLetterStep.nameAndTaxId(payload),
          ...sendSimpleRegisteredLetterStep.completePhysicalAddressFromStep(payload.step),
        }
      )}`,
    });
  });
});
