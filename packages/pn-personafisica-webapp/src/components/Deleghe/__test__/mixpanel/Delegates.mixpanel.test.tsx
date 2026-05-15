import { MockInstance, vi } from 'vitest';

import { mandatesByDelegator } from '../../../../__mocks__/Delegations.mock';
import { fireEvent, render } from '../../../../__test__/test-utils';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import Delegates from '../../Delegates';

describe('Delegates component - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_ADD_MANDATE_START when add delegation button is clicked', () => {
    const { getByTestId } = render(<Delegates />);
    fireEvent.click(getByTestId('add-delegation'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_MANDATE_START);
  });

  it('fires SEND_ADD_MANDATE_START when empty state link is clicked', () => {
    const { getByTestId } = render(<Delegates />);
    fireEvent.click(getByTestId('link-add-delegate'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_MANDATE_START);
  });

  it('does not fire SEND_ADD_MANDATE_START on render with delegates', () => {
    render(<Delegates />, {
      preloadedState: { delegationsState: { delegations: { delegates: mandatesByDelegator } } },
    });
    expect(triggerEventSpy).not.toHaveBeenCalledWith(PFEventsType.SEND_ADD_MANDATE_START);
  });
});
