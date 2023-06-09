import * as React from 'react';
import { act, RenderResult, screen } from '@testing-library/react';
import * as redux from 'react-redux';
import { CourtesyChannelType, DigitalAddress } from '../../../models/contacts';
import * as hooks from '../../../redux/hooks';
import { render } from '../../../__test__/test-utils';
import CourtesyContactsList from '../CourtesyContactsList';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
// import * as actions from '../../../redux/contact/actions';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const emptyMockedStore = {
  legal: [],
  courtesy: [],
};

const mockedStore: Array<DigitalAddress> = [
  {
    addressType: 'courtesy',
    recipientId: 'recipient1',
    senderId: 'default',
    channelType: CourtesyChannelType.SMS,
    value: '3331234567',
    code: '12345',
  },
  {
    addressType: 'courtesy',
    recipientId: 'recipient1',
    senderId: 'default',
    channelType: CourtesyChannelType.EMAIL,
    value: 'test@test.com',
    code: '54321',
  },
];

describe('CourtesyContactsList Component', () => {
  const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
  const mockDispatchFn = jest.fn(() => ({
    unwrap: () => Promise.resolve(),
  }));
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  useDispatchSpy.mockReturnValue(mockDispatchFn as any);
  // const mockActionFn = jest.fn();

  it('renders correctly with empty store', async () => {
    mockUseAppSelector.mockReturnValueOnce(emptyMockedStore).mockReturnValueOnce([]);
    await act(async () => {
      render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactsList recipientId="mock-recipient" contacts={[]} />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    const textBoxes = await screen.findAllByRole('textbox');
    expect(textBoxes).toHaveLength(2);

    const phoneTextBox = await screen.findByTestId('courtesy-contact-phone');
    expect(phoneTextBox).toEqual(textBoxes[0]);
    expect(phoneTextBox).toHaveValue('');

    const mailTextBox = await screen.findByTestId('courtesy-contact-email');
    expect(mailTextBox).toEqual(textBoxes[1]);
    expect(mailTextBox).toHaveValue('');

    const buttons = await screen.findAllByRole('button');
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
    expect(buttons[0].textContent).toMatch('courtesy-contacts.phone-add');
    expect(buttons[1].textContent).toMatch('courtesy-contacts.email-add');
  });

  it('renders correctly with data in store', async () => {
    mockUseAppSelector.mockReturnValueOnce(emptyMockedStore).mockReturnValueOnce(mockedStore);
    await act(async () => {
      render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactsList recipientId="mock-recipient" contacts={mockedStore} />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    const phoneNumber = screen.queryByText(mockedStore[0].value);
    expect(phoneNumber).toBeInTheDocument();
    const email = screen.queryByText(mockedStore[1].value);
    expect(email).toBeInTheDocument();

    const buttons = await screen.findAllByRole('button');
    expect(buttons[0]).toBeEnabled();
    expect(buttons[1]).toBeEnabled();
    expect(buttons[0].textContent).toMatch('button.modifica');
    expect(buttons[1].textContent).toMatch('button.elimina');
  });
});
