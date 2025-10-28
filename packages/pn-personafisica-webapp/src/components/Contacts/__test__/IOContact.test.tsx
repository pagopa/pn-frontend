import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, testStore, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType, IOAllowedValues } from '../../../models/contacts';
import { getConfiguration } from '../../../services/configuration.service';
import IOContact from '../IOContact';

const IOAddress = digitalCourtesyAddresses.find((addr) => addr.channelType === ChannelType.IOMSG);
const assignFn = vi.fn();

describe('IOContact component', async () => {
  let mock: MockAdapter;
  const originalLocation = window.location;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { assign: assignFn },
    });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });

  it('renders component - no contacts', () => {
    const { getByTestId, getByRole, getByText } = render(<IOContact />);
    const title = getByTestId('ioContactTitle');
    expect(title).toHaveTextContent('io-contact.title');
    const description = getByTestId('ioContactDescription');
    expect(description).toHaveTextContent('io-contact.description');
    const chip = getByText('status.inactive');
    expect(chip).toBeInTheDocument();
    const button = getByRole('button', { name: 'io-contact.download' });
    expect(button).toBeInTheDocument();
  });

  it('IO available and disabled', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);
    const { getByTestId, getByRole, getByText } = render(<IOContact />, {
      preloadedState: { contactsState: { digitalAddresses: [IOAddress] } },
    });
    const chip = getByText('status.inactive');
    expect(chip).toBeInTheDocument();
    const enableBtn = getByRole('button', { name: 'io-contact.enable' });
    expect(enableBtn).toBeInTheDocument();
    expect(enableBtn).toBeEnabled();
    // enable IO
    fireEvent.click(enableBtn);
    const informativeDialog = await waitFor(() => getByTestId('informativeDialog'));
    expect(informativeDialog).toBeInTheDocument();
    const understandButton = getByTestId('understandButton');
    expect(understandButton).toBeInTheDocument();
    fireEvent.click(understandButton);
    await waitFor(() => {
      expect(informativeDialog).not.toBeVisible();
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: 'APPIO',
        verificationCode: '00000',
      });
    });
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([{ ...IOAddress, value: IOAllowedValues.ENABLED }]);
  });

  it('IO available and enabled', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/APPIO').reply(200);
    const { getByRole, getByText } = render(<IOContact />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [{ ...IOAddress!, value: IOAllowedValues.ENABLED }],
        },
      },
    });
    const chip = getByText('status.active');
    expect(chip).toBeInTheDocument();

    const disableBtn = getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
    expect(disableBtn).toBeEnabled();
    // disable IO
    fireEvent.click(disableBtn);

    const dialog = await waitFor(() => screen.getByRole('dialog'));
    const dialogButtons = dialog.querySelectorAll('button');
    fireEvent.click(dialogButtons[1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([{ ...IOAddress, value: IOAllowedValues.DISABLED }]);
  });

  it('Click on download AppIO button - desktop', () => {
    const { getByRole } = render(<IOContact />);
    const button = getByRole('button', { name: 'io-contact.download' });
    fireEvent.click(button);
    expect(assignFn).toHaveBeenCalledTimes(1);
    expect(assignFn).toHaveBeenCalledWith(getConfiguration().APP_IO_SITE);
  });

  it('Click on download AppIO button - IOS', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'iPhone' },
    });
    const { getByRole } = render(<IOContact />);
    const button = getByRole('button', { name: 'io-contact.download' });
    fireEvent.click(button);
    expect(assignFn).toHaveBeenCalledTimes(1);
    expect(assignFn).toHaveBeenCalledWith(getConfiguration().APP_IO_IOS);
  });

  it('Click on download AppIO button - Android', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Android' },
    });
    const { getByRole } = render(<IOContact />);
    const button = getByRole('button', { name: 'io-contact.download' });
    fireEvent.click(button);
    expect(assignFn).toHaveBeenCalledTimes(1);
    expect(assignFn).toHaveBeenCalledWith(getConfiguration().APP_IO_ANDROID);
  });

  it('disables IO - Digital Domicile enabled', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/APPIO').reply(200);

    const { getByRole } = render(<IOContact />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.ENABLED,
            },
            {
              addressType: AddressType.LEGAL,
              senderId: 'default',
              channelType: ChannelType.SERCQ_SEND,
              value: SERCQ_SEND_VALUE,
              codeValid: true,
            },
          ],
        },
      },
    });

    const disableBtn = getByRole('button', { name: 'button.disable' });
    fireEvent.click(disableBtn);

    const dialog = await waitFor(() => screen.getByRole('dialog'));

    expect(dialog).toHaveTextContent('io-contact.disable-modal.title');
    expect(dialog).toHaveTextContent('io-contact.disable-modal.content-dod-enabled');

    const cancelBtn = getByRole('button', { name: 'button.annulla' });
    const confirmBtn = getByRole('button', {
      name: 'io-contact.disable-modal.confirm-dod-enabled',
    });
    expect(cancelBtn).toBeInTheDocument();
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
  });
});
