import { DefaultStep } from '../DefaultStep';

describe('DefaultStep', () => {
  it('test getTimelineStepInfo', () => {
    const defaultStep = new DefaultStep();

    expect(defaultStep.getTimelineStepInfo()).toStrictEqual({
      label: 'Non definito',
      description: 'Stato sconosciuto',
    });
  });
});
