import { mockTimelineStepAnalogFailureWorkflow } from '../../../__mocks__/TimelineStep.mock';
import { NotHandledStep } from '../NotHandledStep';

describe('NotHandledStep', () => {
  it('test getTimelineStepInfo with with proper reason and reasonCode values', () => {
    const notHandledStep = new NotHandledStep();

    expect(notHandledStep.getTimelineStepInfo(mockTimelineStepAnalogFailureWorkflow)).toStrictEqual(
      {
        label: 'Annullata',
        description: `La notifica è stata inviata per via cartacea, dopo un tentativo di invio per via digitale durante il collaudo della piattaforma.`,
      }
    );
  });

  it('test getTimelineStepInfo with with wrong reason and reasonCode values', () => {
    const notHandledStep = new NotHandledStep();

    expect(
      notHandledStep.getTimelineStepInfo({
        ...mockTimelineStepAnalogFailureWorkflow,
        step: {
          ...mockTimelineStepAnalogFailureWorkflow.step,
          details: { reason: '', reasonCode: '' },
        },
      })
    ).toStrictEqual(null);
  });
});
