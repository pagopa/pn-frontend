import _ from 'lodash';

import { mockTimelineStepSendDigitalProgress } from '../../../__mocks__/TimelineStep.mock';
import { SendDigitalDetails } from '../../../types';
import { SendDigitalProgressStep } from '../SendDigitalProgressStep';

const setDeliveryCode = (deliveryCode: string) => {
  let cloneMockTimelineStepSendDigitalProgress = _.cloneDeep(mockTimelineStepSendDigitalProgress);
  (cloneMockTimelineStepSendDigitalProgress.step.details as SendDigitalDetails).deliveryDetailCode =
    deliveryCode;
  return cloneMockTimelineStepSendDigitalProgress;
};

describe('SendDigitalProgressStep - test getTimelineStepInfo with deliveryDetailCode C008, C010 and DP10', () => {
  const deliveryCodes = ['C008', 'C010', 'DP10'];
  deliveryCodes.forEach((code) => {
    it(`test getTimelineStepInfo with deliveryDetailCode ${code}`, () => {
      const sendDigitalDomicileStep = new SendDigitalProgressStep();
      const digitalAddress = (
        mockTimelineStepSendDigitalProgress.step.details as SendDigitalDetails
      ).digitalAddress;
      expect(sendDigitalDomicileStep.getTimelineStepInfo(setDeliveryCode(code))).toStrictEqual({
        label: `Invio via PEC non preso in carico`,
        description: `L'invio della notifica a ${mockTimelineStepSendDigitalProgress.recipient?.denomination} all'indirizzo PEC ${digitalAddress?.address} non è stato preso in carico.`,
      });
    });
  });
});

describe('SendDigitalProgressStep - test getTimelineStepInfo with deliveryDetailCode C001 and DP00', () => {
  const deliveryCodes = ['C001', 'DP00'];
  deliveryCodes.forEach((code) => {
    it(`test getTimelineStepInfo with deliveryDetailCode ${code}`, () => {
      const sendDigitalDomicileStep = new SendDigitalProgressStep();
      const digitalAddress = (
        mockTimelineStepSendDigitalProgress.step.details as SendDigitalDetails
      ).digitalAddress;
      expect(sendDigitalDomicileStep.getTimelineStepInfo(setDeliveryCode(code))).toStrictEqual({
        label: `Invio via PEC preso in carico`,
        description: `L'invio della notifica a ${mockTimelineStepSendDigitalProgress.recipient?.denomination} all'indirizzo PEC ${digitalAddress?.address} è stato preso in carico.`,
      });
    });
  });
});

describe('SendDigitalProgressStep - test with unhandled deliveryDetailCode', () => {
  it(`test getTimelineStepInfo with unhandled deliveryDetailCode`, () => {
    const sendDigitalDomicileStep = new SendDigitalProgressStep();
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo(setDeliveryCode('mocked-code'))
    ).toStrictEqual(null);
  });
});
