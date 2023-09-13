import _ from 'lodash';

import { mockTimelineStepSendDigitalDomicile } from '../../../__mocks__/TimelineStep.mock';
import { DigitalDomicileType, SendCourtesyMessageDetails } from '../../../types';
import { SendCourtesyMessageStep } from '../SendCourtesyMessageStep';
import { TimelineStepPayload } from '../TimelineStep';

const setDigitalAddressType = (type: DigitalDomicileType): TimelineStepPayload => {
  let clonedMockTimelineStepSendDigitalDomicile = _.cloneDeep(mockTimelineStepSendDigitalDomicile);
  (
    clonedMockTimelineStepSendDigitalDomicile.step.details as SendCourtesyMessageDetails
  ).digitalAddress.type = type;
  return clonedMockTimelineStepSendDigitalDomicile;
};

describe('SendCourtesyMessageStep', () => {
  it('test getTimelineStepInfo app IO', () => {
    const sendCourtesyMessageStep = new SendCourtesyMessageStep();

    expect(
      sendCourtesyMessageStep.getTimelineStepInfo(setDigitalAddressType(DigitalDomicileType.APPIO))
    ).toStrictEqual({
      description: `È in corso l'invio del messaggio di cortesia a ${mockTimelineStepSendDigitalDomicile.recipient?.denomination} tramite app IO`,
      label: 'Invio del messaggio di cortesia',
    });
  });

  it('test getTimelineStepInfo sms', () => {
    const sendCourtesyMessageStep = new SendCourtesyMessageStep();

    expect(
      sendCourtesyMessageStep.getTimelineStepInfo(setDigitalAddressType(DigitalDomicileType.SMS))
    ).toStrictEqual({
      description: `È in corso l'invio del messaggio di cortesia a ${mockTimelineStepSendDigitalDomicile.recipient?.denomination} tramite sms`,
      label: 'Invio del messaggio di cortesia',
    });
  });

  it('test getTimelineStepInfo email', () => {
    const sendCourtesyMessageStep = new SendCourtesyMessageStep();

    expect(
      sendCourtesyMessageStep.getTimelineStepInfo(setDigitalAddressType(DigitalDomicileType.EMAIL))
    ).toStrictEqual({
      description: `È in corso l'invio del messaggio di cortesia a ${mockTimelineStepSendDigitalDomicile.recipient?.denomination} tramite email`,
      label: 'Invio del messaggio di cortesia',
    });
  });
});
