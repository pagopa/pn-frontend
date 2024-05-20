import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { RenderResult, fireEvent, render, testStore, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, CourtesyChannelType, IOAllowedValues } from '../../../models/contacts';
import IOContact from '../IOContact';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const IOAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === CourtesyChannelType.IOMSG
);

describe('IOContact component', async () => {
  let mock: MockAdapter;
  let result: RenderResult;

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
    result = render(<IOContact contact={null} />);
    const cardAvatar = result.container.querySelector('svg>title');
    expect(cardAvatar).toBeInTheDocument();
    const title = result.getByRole('heading', { name: 'io-contact.subtitle' });
    expect(title).toBeInTheDocument();
    const ioCheckbox = result.queryByRole('checkbox', { name: 'io-contact.switch-label' });
    expect(ioCheckbox).not.toBeInTheDocument();
    const alert = result.queryByTestId('appIO-contact-disclaimer');
    expect(alert).not.toBeInTheDocument();
    const link = result.container.querySelector('a');
    expect(link).not.toBeInTheDocument();
  });

  it('IO unavailable', () => {
    result = render(<IOContact contact={undefined} />);
    const ioCheckbox = result.queryByRole('checkbox', { name: 'io-contact.switch-label' });
    expect(ioCheckbox).not.toBeInTheDocument();
    const alert = result.getByTestId('appIO-contact-disclaimer');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('io-contact.disclaimer-message-unavailable');
    /** Waiting for FAQs */
    // expect(alert).not.toHaveTextContent('io-contact.disclaimer-link');
    const link = result.container.querySelector('a');
    expect(link).not.toBeInTheDocument();
  });

  it('IO available and disabled', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);
    result = render(<IOContact contact={IOAddress} />, {
      preloadedState: { contactsState: { digitalAddresses: [IOAddress] } },
    });
    result.getByTestId('CloseIcon');
    result.getByText('io-contact.disabled');
    const enableBtn = result.getByRole('button', { name: 'button.enable' });
    expect(enableBtn).toBeInTheDocument();
    expect(enableBtn).toBeEnabled();
    const alert = result.getByTestId('appIO-contact-disclaimer');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('io-contact.disclaimer-message');
    /** Waiting for FAQs */
    // expect(alert).toHaveTextContent('io-contact.disclaimer-link');
    // const link = result.container.querySelector('a');
    // expect(link).toBeInTheDocument();
    // expect(link).toHaveTextContent('io-contact.disclaimer-link');
    // enable IO
    fireEvent.click(enableBtn);
    const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
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
    result = render(<IOContact contact={{ ...IOAddress!, value: IOAllowedValues.ENABLED }} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [{ ...IOAddress!, value: IOAllowedValues.ENABLED }],
        },
      },
    });
    result.getByTestId('CheckIcon');
    result.getByText('io-contact.enabled');
    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
    expect(disableBtn).toBeEnabled();
    const alert = result.getByTestId('appIO-contact-disclaimer');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('io-contact.disclaimer-message');
    /** Waiting for FAQs */
    // expect(alert).toHaveTextContent('io-contact.disclaimer-link');
    // const link = result.container.querySelector('a');
    // expect(link).toBeInTheDocument();
    // expect(link).toHaveTextContent('io-contact.disclaimer-link');
    // disable IO
    fireEvent.click(disableBtn);
    const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
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
