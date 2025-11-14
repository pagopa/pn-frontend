import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { TimelineCategory } from '../../../models/NotificationDetail';
import { NotHandledStep } from '../NotHandledStep';

const timelineElem = getTimelineElem(TimelineCategory.NOT_HANDLED, {
  reasonCode: '001',
  reason: 'Paper message not handled',
});
const payload = {
  step: timelineElem,
  recipient: notificationDTO.recipients[0],
  isMultiRecipient: false,
};

describe('NotHandledStep', () => {
  it('test getTimelineStepInfo with with proper reason and reasonCode values', () => {
    const notHandledStep = new NotHandledStep();
    expect(notHandledStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: 'Annullata',
      description: `La notifica è stata inviata per via cartacea, dopo un tentativo di invio per via digitale durante il collaudo della piattaforma.`,
    });
  });

  it('test getTimelineStepInfo with with wrong reason and reasonCode values', () => {
    const notHandledStep = new NotHandledStep();
    expect(
      notHandledStep.getTimelineStepInfo({ ...payload, step: { ...payload.step, details: {} } })
    ).toStrictEqual(null);
  });
});
