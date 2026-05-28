import { vi } from 'vitest';

import {
  PFTriggerEventSpy,
  fireEvent,
  render,
  screen,
  within,
} from '../../../../__test__/test-utils';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import CancelVerificationModal from '../../CancelVerificationModal';

describe('CancelVerificationModal - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_PEC_CANCEL_VALIDATION_POP_UP when opened', () => {
    render(<CancelVerificationModal open handleClose={vi.fn()} />);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_PEC_CANCEL_VALIDATION_POP_UP);
  });

  it('fires SEND_PEC_CANCEL_VALIDATION_CANCEL when the cancel button is clicked', () => {
    render(<CancelVerificationModal open handleClose={vi.fn()} />);
    const dialog = screen.getByTestId('cancelVerificationModal');
    const buttons = within(dialog).getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_PEC_CANCEL_VALIDATION_CANCEL);
  });

  it('fires SEND_PEC_CANCEL_VALIDATION_CONFIRM when the confirm button is clicked', () => {
    render(<CancelVerificationModal open handleClose={vi.fn()} />);
    const dialog = screen.getByTestId('cancelVerificationModal');
    const buttons = within(dialog).getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_PEC_CANCEL_VALIDATION_CONFIRM);
  });
});
