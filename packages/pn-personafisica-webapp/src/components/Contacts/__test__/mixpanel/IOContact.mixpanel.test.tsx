import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { digitalCourtesyAddresses } from '../../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { ChannelType, IOAllowedValues } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import IOContact from '../../IOContact';

const IOAddress = digitalCourtesyAddresses.find((addr) => addr.channelType === ChannelType.IOMSG)!;
const IOAddressEnabled = { ...IOAddress, value: IOAllowedValues.ENABLED };

describe('IOContact - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  const renderDisabled = () =>
    render(<IOContact />, {
      preloadedState: { contactsState: { digitalAddresses: [IOAddress] } },
    });

  const renderEnabled = () =>
    render(<IOContact />, {
      preloadedState: { contactsState: { digitalAddresses: [IOAddressEnabled] } },
    });

  it('fires SEND_ACTIVE_IO_START and SEND_ACTIVE_IO_UX_CONVERSION when IO is enabled via informative dialog', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/APPIO').reply(204);
    renderDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'io-contact.enable' }));
    const understandButton = await waitFor(() => screen.getByTestId('understandButton'));
    fireEvent.click(understandButton);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ACTIVE_IO_START);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION);
  });

  it('fires SEND_ACTIVE_IO_UX_SUCCESS after IO enable API succeeds', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/APPIO').reply(204);
    renderDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'io-contact.enable' }));
    const understandButton = await waitFor(() => screen.getByTestId('understandButton'));
    fireEvent.click(understandButton);
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS, false);
    });
  });

  it('fires SEND_ACTIVE_IO_CANCEL when informative dialog is cancelled', async () => {
    renderDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'io-contact.enable' }));
    await waitFor(() => screen.getByTestId('informativeDialog'));
    fireEvent.click(screen.getByTestId('discardButton'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ACTIVE_IO_CANCEL);
  });

  it('fires SEND_DEACTIVE_IO_POP_UP when the disable button is clicked', () => {
    renderEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DEACTIVE_IO_POP_UP,
      expect.objectContaining({ event_type: expect.any(String), legal_addresses: expect.any(Array) })
    );
  });

  it('fires SEND_DEACTIVE_IO_CANCEL when the disable dialog is cancelled', async () => {
    renderEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(dialog.querySelectorAll('button')[0]);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DEACTIVE_IO_CANCEL,
      expect.objectContaining({ event_type: expect.any(String), legal_addresses: expect.any(Array) })
    );
  });

  // SEND_DEACTIVE_IO_START fires inside handleConfirm (InformativeDialog) only when isAppIOEnabled=true,
  // but InformativeDialog only opens via the enable button (IO disabled) — unreachable in practice.
  it('fires SEND_DEACTIVE_IO_UX_CONVERSION when disable is confirmed', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/APPIO').reply(200);
    renderEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(dialog.querySelectorAll('button')[1]);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DEACTIVE_IO_UX_CONVERSION,
      expect.objectContaining({ event_type: expect.any(String), legal_addresses: expect.any(Array) })
    );
  });

  it('fires SEND_DEACTIVE_IO_UX_SUCCESS after IO disable API succeeds', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/APPIO').reply(200);
    renderEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(dialog.querySelectorAll('button')[1]);
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_DEACTIVE_IO_UX_SUCCESS,
        expect.objectContaining({ event_type: expect.any(String), legal_addresses: expect.any(Array) })
      );
    });
  });
});
