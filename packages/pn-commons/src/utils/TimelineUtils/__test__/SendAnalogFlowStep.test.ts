import { mockTimelineStepAnalogFailureWorkflow } from '../../../__mocks__/TimelineStep.mock';
import { TimelineCategory } from '../../../types';
import { SendAnalogFlowStep } from '../SendAnalogFlowStep';

const setTimelineCategory = (category: TimelineCategory) => ({
  ...mockTimelineStepAnalogFailureWorkflow,
  step: {
    ...mockTimelineStepAnalogFailureWorkflow.step,
    category,
  },
});

describe('SendAnalogFlowStep', () => {
  it('getTimelineStepLabel SEND_ANALOG_DOMICILE', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();

    expect(
      sendAnalogFlowStep.getTimelineStepLabel(
        setTimelineCategory(TimelineCategory.SEND_ANALOG_DOMICILE)
      )
    ).toStrictEqual('Invio cartaceo completato');
  });

  it('getTimelineStepLabel SEND_ANALOG_PROGRESS', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();

    expect(
      sendAnalogFlowStep.getTimelineStepLabel(
        setTimelineCategory(TimelineCategory.SEND_ANALOG_PROGRESS)
      )
    ).toStrictEqual("Aggiornamento sull'invio cartaceo");
  });

  it('getTimelineStepLabel SEND_SIMPLE_REGISTERED_LETTER_PROGRESS', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();

    expect(
      sendAnalogFlowStep.getTimelineStepLabel(
        setTimelineCategory(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS)
      )
    ).toStrictEqual("Aggiornamento dell'invio via raccomandata semplice");
  });

  it('getTimelineStepInfo SEND_ANALOG_DOMICILE', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();

    expect(
      sendAnalogFlowStep.getTimelineStepInfo(
        setTimelineCategory(TimelineCategory.SEND_ANALOG_DOMICILE)
      )
    ).toStrictEqual({
      description: "C'è un aggiornamento sull'invio cartaceo.",
      label: 'Invio cartaceo completato',
    });
  });

  it('getTimelineStepInfo SEND_ANALOG_PROGRESS', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();

    expect(
      sendAnalogFlowStep.getTimelineStepInfo(
        setTimelineCategory(TimelineCategory.SEND_ANALOG_PROGRESS)
      )
    ).toStrictEqual({
      description: "C'è un aggiornamento sull'invio cartaceo.",
      label: "Aggiornamento sull'invio cartaceo",
    });
  });

  it('getTimelineStepInfo SEND_SIMPLE_REGISTERED_LETTER_PROGRESS', () => {
    const sendAnalogFlowStep = new SendAnalogFlowStep();

    expect(
      sendAnalogFlowStep.getTimelineStepInfo(
        setTimelineCategory(TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS)
      )
    ).toStrictEqual({
      description: "C'è un aggiornamento sull'invio cartaceo.",
      label: "Aggiornamento dell'invio via raccomandata semplice",
    });
  });
});
