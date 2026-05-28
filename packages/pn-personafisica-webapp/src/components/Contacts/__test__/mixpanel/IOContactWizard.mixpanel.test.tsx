import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  PFTriggerEventSpy,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { PFEventsType } from '../../../../models/PFEventsType';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../models/contacts';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import IOContactWizard from '../../IOContactWizard';

const ioEnabled = [
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: ChannelType.IOMSG,
    value: IOAllowedValues.ENABLED,
  },
];

const ioDisabled = [
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: ChannelType.IOMSG,
    value: IOAllowedValues.DISABLED,
  },
];

describe('IOContactWizard - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;
  const goToNextStep = vi.fn();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_ADD_SERCQ_SEND_APP_IO on mount', () => {
    render(<IOContactWizard goToNextStep={goToNextStep} />);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_APP_IO,
      expect.objectContaining({ event_type: expect.any(String) })
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_CONNECT_IO_UX_CONVERSION and SEND_ADD_SERCQ_SEND_CONNECT_IO_UX_SUCCESS when IO is activated', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);

    const { getByTestId } = render(<IOContactWizard goToNextStep={goToNextStep} />);
    fireEvent.click(getByTestId('confirmButton'));

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_CONNECT_IO_UX_CONVERSION
    );
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_CONNECT_IO_UX_SUCCESS
      );
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_APP_IO_NEXT_STEP when the continue button is clicked (IO enabled)', () => {
    const { getByTestId } = render(<IOContactWizard goToNextStep={goToNextStep} />, {
      preloadedState: { contactsState: { digitalAddresses: ioEnabled } },
    });
    fireEvent.click(getByTestId('skipButton'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_APP_IO_NEXT_STEP);
  });

  it('fires SEND_ADD_SERCQ_SEND_REMOVE_IO and SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO when deactivate is clicked', () => {
    const { getByTestId } = render(<IOContactWizard goToNextStep={goToNextStep} />, {
      preloadedState: { contactsState: { digitalAddresses: ioEnabled } },
    });
    fireEvent.click(getByTestId('disableIOButton'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_REMOVE_IO);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_DISCONNECT and SEND_ADD_SERCQ_SEND_REMOVE_IO_SUCCESS when deactivation is confirmed', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/APPIO').reply(200);

    const { getByTestId, getByRole } = render(<IOContactWizard goToNextStep={goToNextStep} />, {
      preloadedState: { contactsState: { digitalAddresses: ioEnabled } },
    });
    fireEvent.click(getByTestId('disableIOButton'));
    await waitFor(() => getByRole('dialog'));
    // confirmButton slot → handleIODeactivation (DELETE)
    fireEvent.click(getByTestId('confirmButton'));

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_DISCONNECT
    );
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_REMOVE_IO_SUCCESS
      );
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_CANCEL when deactivation modal is cancelled', async () => {
    const { getByTestId, getByRole } = render(<IOContactWizard goToNextStep={goToNextStep} />, {
      preloadedState: { contactsState: { digitalAddresses: ioEnabled } },
    });
    fireEvent.click(getByTestId('disableIOButton'));
    const dialog = await waitFor(() => getByRole('dialog'));
    // closeButton slot → handleConfirmationModalDecline (cancel)
    fireEvent.click(within(dialog).getByTestId('closeButton'));

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_CANCEL
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_CONTINUE_WITHOUT_IO and SEND_ADD_SERCQ_SEND_POP_UP_APP_IO when skip is clicked', () => {
    const { getByTestId } = render(<IOContactWizard goToNextStep={goToNextStep} />, {
      preloadedState: { contactsState: { digitalAddresses: ioDisabled } },
    });
    fireEvent.click(getByTestId('skipButton'));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_CONTINUE_WITHOUT_IO
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_APP_IO);
  });

  it('fires SEND_ADD_SERCQ_SEND_POP_UP_APP_IO_DECLINED when skip modal is dismissed', async () => {
    const { getByTestId, getByRole } = render(<IOContactWizard goToNextStep={goToNextStep} />, {
      preloadedState: { contactsState: { digitalAddresses: ioDisabled } },
    });
    fireEvent.click(getByTestId('skipButton'));
    const dialog = await waitFor(() => getByRole('dialog'));
    fireEvent.click(dialog.querySelector('[data-testid="closeButton"]')!);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_APP_IO_DECLINED
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_POP_UP_APP_IO_CONNECT when IO is activated from skip modal', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);

    const { getByTestId, getByRole } = render(<IOContactWizard goToNextStep={goToNextStep} />, {
      preloadedState: { contactsState: { digitalAddresses: ioDisabled } },
    });
    fireEvent.click(getByTestId('skipButton'));
    const dialog = await waitFor(() => getByRole('dialog'));
    fireEvent.click(dialog.querySelector('[data-testid="confirmButton"]')!);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_APP_IO_CONNECT
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_CONNECT_IO_UX_CONVERSION
    );
  });
});
