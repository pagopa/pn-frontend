import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { TimelineCategory } from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { SendAnalogFlowStep } from '../SendAnalogFlowStep';
import { TimelineStepPayload } from '../TimelineStep';

let timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_DOMICILE, {});
const payload: TimelineStepPayload = {
  step: timelineElem,
  recipient: notificationDTO.recipients[0],
  isMultiRecipient: false,
  allStepsForThisStatus: [],
};

const physicalAddress = {
  at: '',
  addressDetails: '',
  address: 'Via Mazzini 1848',
  zip: '98036',
  municipality: 'Graniti',
  province: '',
  foreignState: 'Italy',
};

describe('SendAnalogFlowStep', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('getTimelineStepLabel SEND_ANALOG_DOMICILE', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();
    expect(sendAnalogFlowStep.getTimelineStepLabel(payload)).toStrictEqual(
      'notifiche - detail.timeline.send-analog-unknown'
    );
  });

  it('getTimelineStepLabel SEND_ANALOG_PROGRESS', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();
    timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_PROGRESS, {});
    payload.step = timelineElem;
    expect(sendAnalogFlowStep.getTimelineStepLabel(payload)).toStrictEqual(
      'notifiche - detail.timeline.send-analog-progress'
    );
  });

  it('getTimelineStepLabel SEND_SIMPLE_REGISTERED_LETTER_PROGRESS', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();
    timelineElem = getTimelineElem(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS, {});
    payload.step = timelineElem;
    expect(sendAnalogFlowStep.getTimelineStepLabel(payload)).toStrictEqual(
      'notifiche - detail.timeline.simple-registered-letter-progess'
    );
  });

  it('getTimelineStepLabel SEND_ANALOG_FEEDBACK', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();
    // OK status
    timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_FEEDBACK, {
      deliveryDetailCode: 'RECAG001C',
    });
    payload.step = timelineElem;
    expect(sendAnalogFlowStep.getTimelineStepLabel(payload)).toStrictEqual(
      'notifiche - detail.timeline.send-analog-success'
    );
    // KO status
    timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_FEEDBACK, {
      deliveryDetailCode: 'PNAG012',
    });
    payload.step = timelineElem;
    expect(sendAnalogFlowStep.getTimelineStepLabel(payload)).toStrictEqual(
      'notifiche - detail.timeline.send-analog-error'
    );
    // UNKNOWN status
    timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_FEEDBACK, {
      deliveryDetailCode: 'INVTSTS',
    });
    payload.step = timelineElem;
    expect(sendAnalogFlowStep.getTimelineStepLabel(payload)).toStrictEqual(
      'notifiche - detail.timeline.send-analog-outcome-unknown'
    );
  });

  it('getTimelineStepInfo SEND_ANALOG_PROGRESS - no extra data', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();
    timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_PROGRESS, {
      deliveryDetailCode: 'CON080',
      sendRequestId: 'SEND_ANALOG_DOMICILE_0',
    });
    payload.step = timelineElem;
    // mono recipient
    expect(sendAnalogFlowStep.getTimelineStepInfo(payload)).toStrictEqual({
      description: `notifiche - detail.timeline.send-analog-flow-CON080-description - ${JSON.stringify(
        {
          ...sendAnalogFlowStep.nameAndTaxId(payload),
          registeredLetterKind: '',
          deliveryFailureCause: '',
          registeredLetterNumber: '',
        }
      )}`,
      label: sendAnalogFlowStep.getTimelineStepLabel(payload),
    });
    // multi recipient
    payload.isMultiRecipient = true;
    expect(sendAnalogFlowStep.getTimelineStepInfo(payload)).toStrictEqual({
      description: `notifiche - detail.timeline.send-analog-flow-CON080-description-multirecipient - ${JSON.stringify(
        {
          ...sendAnalogFlowStep.nameAndTaxId(payload),
          registeredLetterKind: '',
          deliveryFailureCause: '',
          registeredLetterNumber: '',
        }
      )}`,
      label: sendAnalogFlowStep.getTimelineStepLabel(payload),
    });
  });

  it('getTimelineStepInfo SEND_ANALOG_PROGRESS - with extra data', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();
    const sendAnalogDomicileElem = getTimelineElem(TimelineCategory.SEND_ANALOG_DOMICILE, {
      deliveryDetailCode: 'CON080',
      physicalAddress,
      productType: 'AR',
    });
    timelineElem = getTimelineElem(TimelineCategory.SEND_ANALOG_PROGRESS, {
      deliveryDetailCode: 'CON080',
      sendRequestId: sendAnalogDomicileElem.elementId,
      deliveryFailureCause: 'M05',
      registeredLetterCode: 'RACC-034-B93',
    });
    payload.step = timelineElem;
    payload.allStepsForThisStatus = [sendAnalogDomicileElem];
    payload.isMultiRecipient = false;
    // mono recipient
    expect(sendAnalogFlowStep.getTimelineStepInfo(payload)).toStrictEqual({
      description: `notifiche - detail.timeline.send-analog-flow-CON080-description - ${JSON.stringify(
        {
          ...sendAnalogFlowStep.nameAndTaxId(payload),
          ...sendAnalogFlowStep.completePhysicalAddressFromStep(sendAnalogDomicileElem),
          registeredLetterKind: ` notifiche - detail.timeline.registered-letter-kind.AR`,
          deliveryFailureCause: `notifiche - detail.timeline.analog-workflow-failure-cause.M05`,
          registeredLetterNumber: 'RACC-034-B93',
        }
      )}`,
      label: sendAnalogFlowStep.getTimelineStepLabel(payload),
    });
    // multi recipient
    payload.isMultiRecipient = true;
    expect(sendAnalogFlowStep.getTimelineStepInfo(payload)).toStrictEqual({
      description: `notifiche - detail.timeline.send-analog-flow-CON080-description-multirecipient - ${JSON.stringify(
        {
          ...sendAnalogFlowStep.nameAndTaxId(payload),
          ...sendAnalogFlowStep.completePhysicalAddressFromStep(sendAnalogDomicileElem),
          registeredLetterKind: ` notifiche - detail.timeline.registered-letter-kind.AR`,
          deliveryFailureCause: `notifiche - detail.timeline.analog-workflow-failure-cause.M05`,
          registeredLetterNumber: 'RACC-034-B93',
        }
      )}`,
      label: sendAnalogFlowStep.getTimelineStepLabel(payload),
    });
  });
});
