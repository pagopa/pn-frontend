import { vi } from 'vitest';
import { MockInstance } from 'vitest';

import { fireEvent, render } from '../../../../__test__/test-utils';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import HowItWorksContactWizard from '../../HowItWorksContactWizard';

describe('HowItWorksContactWizard - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  const goToNextStep = vi.fn();
  const setShowPecWizard = vi.fn();

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
    vi.clearAllMocks();
  });

  it('fires SEND_ADD_SERCQ_SEND_INTRO on mount', () => {
    render(
      <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_INTRO,
      expect.objectContaining({ event_type: expect.any(String) })
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_POP_UP when the delivered info link is clicked', () => {
    const { getByTestId } = render(
      <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
    );
    fireEvent.click(getByTestId('deliveredLink'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP);
  });

  it('fires SEND_ADD_SERCQ_SEND_START when the continue button is clicked', () => {
    const { getByTestId } = render(
      <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
    );
    fireEvent.click(getByTestId('continueButton'));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_START,
      expect.objectContaining({ event_type: expect.any(String) })
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_PEC_START when the insert PEC button is clicked', () => {
    const { getByTestId } = render(
      <HowItWorksContactWizard goToNextStep={goToNextStep} setShowPecWizard={setShowPecWizard} />
    );
    fireEvent.click(getByTestId('pec-section').querySelector('button')!);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_PEC_START,
      expect.objectContaining({ event_type: expect.any(String) })
    );
  });
});
