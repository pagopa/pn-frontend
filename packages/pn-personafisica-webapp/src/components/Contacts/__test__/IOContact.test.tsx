import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, testStore, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType, IOAllowedValues } from '../../../models/contacts';
import IOContact from '../IOContact';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const IOAddress = digitalCourtesyAddresses.find((addr) => addr.channelType === ChannelType.IOMSG);

describe('IOContact component', async () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders component - no contacts', () => {
    const { getByTestId, getByText, getByRole } = render(<IOContact />);
    const title = getByTestId('DigitalContactsCardTitle');
    expect(title).toHaveTextContent('io-contact.title');
    const description = getByTestId('DigitalContactsCardDescription');
    expect(description).toHaveTextContent('io-contact.description');
    const text = getByText('io-contact.unavailable');
    const button = getByRole('button', { name: 'io-contact.download' });
    expect(text).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('IO available and disabled', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);
    const { getByTestId, getByText, getByRole } = render(<IOContact />, {
      preloadedState: { contactsState: { digitalAddresses: [IOAddress] } },
    });
    getByTestId('DoDisturbOnOutlinedIcon');
    getByText('io-contact.disabled');
    const enableBtn = getByRole('button', { name: 'io-contact.enable' });
    expect(enableBtn).toBeInTheDocument();
    expect(enableBtn).toBeEnabled();
    // enable IO
    fireEvent.click(enableBtn);
    const disclaimerCheckbox = await waitFor(() => getByTestId('disclaimer-checkbox'));
    const disclaimerConfirmButton = getByTestId('disclaimer-confirm-button');
    expect(disclaimerConfirmButton).toHaveTextContent('io-contact.enable-modal.confirm');
    expect(disclaimerConfirmButton).toBeDisabled();
    fireEvent.click(disclaimerCheckbox);
    await waitFor(() => {
      expect(disclaimerConfirmButton).toBeEnabled();
    });
    fireEvent.click(disclaimerConfirmButton);
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
    const { getByTestId, getByText, getByRole } = render(<IOContact />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [{ ...IOAddress!, value: IOAllowedValues.ENABLED }],
        },
      },
    });
    getByTestId('VerifiedIcon');
    getByText('io-contact.enabled');
    const disableBtn = getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
    expect(disableBtn).toBeEnabled();
    // disable IO
    fireEvent.click(disableBtn);
    const disclaimerCheckbox = await waitFor(() => getByTestId('disclaimer-checkbox'));
    const disclaimerConfirmButton = getByTestId('disclaimer-confirm-button');
    expect(disclaimerConfirmButton).toHaveTextContent('io-contact.disable-modal.confirm');
    expect(disclaimerConfirmButton).toBeDisabled();
    fireEvent.click(disclaimerCheckbox);
    await waitFor(() => {
      expect(disclaimerConfirmButton).toBeEnabled();
    });
    fireEvent.click(disclaimerConfirmButton);
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([{ ...IOAddress, value: IOAllowedValues.DISABLED }]);
  });
});
