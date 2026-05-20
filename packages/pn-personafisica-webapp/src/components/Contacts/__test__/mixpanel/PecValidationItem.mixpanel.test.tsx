import { MockInstance, vi } from 'vitest';

import { fireEvent, render, screen } from '../../../../__test__/test-utils';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import PecValidationItem from '../../PecValidationItem';

describe('PecValidationItem - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_PEC_CANCEL_VALIDATION when the cancel validation button is clicked', () => {
    render(<PecValidationItem senderId="default" onCancelValidation={vi.fn()} />);
    fireEvent.click(screen.getByTestId('cancelValidation'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_PEC_CANCEL_VALIDATION);
  });
});
