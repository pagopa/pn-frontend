import { MockInstance, vi } from 'vitest';

import { fireEvent, render } from '../../../../__test__/test-utils';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { Menu } from '../../DelegationsElements';

const mockSetCodeModal = vi.fn();

describe('DelegationsElements - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.clearAllMocks();
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_SHOW_MANDATE_CODE when show code menu item is clicked', () => {
    const { getByTestId } = render(
      <Menu
        menuType="delegates"
        id="111"
        setCodeModal={mockSetCodeModal}
        name="mocked-name"
        verificationCode="01234"
      />
    );
    fireEvent.click(getByTestId('delegationMenuIcon'));
    fireEvent.click(getByTestId('menuItem-showCode'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_SHOW_MANDATE_CODE);
  });

  it('does not fire SEND_SHOW_MANDATE_CODE when revoke menu item is clicked', () => {
    const { getByTestId } = render(
      <Menu menuType="delegates" id="111" setCodeModal={mockSetCodeModal} name="mocked-name" />
    );
    fireEvent.click(getByTestId('delegationMenuIcon'));
    fireEvent.click(getByTestId('menuItem-revokeDelegate'));
    expect(triggerEventSpy).not.toHaveBeenCalledWith(PFEventsType.SEND_SHOW_MANDATE_CODE);
  });
});
