import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';
import { getById, testAutocomplete, testSelect } from '@pagopa-pn/pn-commons/src/test-utils';
import { fireEvent, waitFor } from '@testing-library/react';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { act, render, screen, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import { CONTACT_ACTIONS } from '../../../redux/contact/actions';
import AddSpecialContactDialog from '../AddSpecialContactDialog';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const discardHandler = vi.fn();
const confirmHandler = vi.fn();

describe('test AddSpecialContactDialog', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component - insert mode', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    render(
      <AddSpecialContactDialog
        open
        value=""
        sender={{ senderId: 'default', senderName: '' }}
        channelType={ChannelType.EMAIL}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />,
      {
        preloadedState: { contactsState: { digitalAddresses } },
      }
    );
    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(`special-contacts.modal-title`);
    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(`special-contacts.email`);
    const input = getById(bodyEl, 's_value');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(bodyEl).toHaveTextContent(`special-contacts.senders`);
    const senderAutoComplete = within(bodyEl).getByTestId('sender');
    expect(senderAutoComplete).toBeInTheDocument();
    const senderChips = within(bodyEl).queryAllByTestId('sender_chip');
    expect(senderChips).toHaveLength(0);
    const alreadyExistsAlert = within(bodyEl).queryByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).not.toBeInTheDocument();
    const cancelButton = within(dialog).getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    const confirmButton = within(dialog).getByText('button.associa');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  it('insert address', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    render(
      <AddSpecialContactDialog
        open
        value=""
        sender={{ senderId: 'default', senderName: '' }}
        channelType={ChannelType.EMAIL}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />,
      {
        preloadedState: { contactsState: { digitalAddresses } },
      }
    );
    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const bodyEl = within(dialog).getByTestId('dialog-content');
    const input = getById(bodyEl, 's_value');
    // fill with invalid value
    fireEvent.change(input, { target: { value: 'invalid value' } });
    await waitFor(() => {
      expect(input).toHaveValue('invalid value');
    });
    const errorMessage = getById(bodyEl, `s_value-helper-text`);
    expect(errorMessage).toBeInTheDocument();
    const confirmButton = within(dialog).getByText('button.associa');
    expect(confirmButton).toBeDisabled();
    // fill with valid value
    fireEvent.change(input, { target: { value: 'mocked@email.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('mocked@email.it');
    });
    expect(errorMessage).not.toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    // select sender
    await testAutocomplete(bodyEl, 'sender', parties, true, 1, true);
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(1);
      expect(confirmHandler).toHaveBeenCalledWith(
        'mocked@email.it',
        ChannelType.EMAIL,
        AddressType.COURTESY,
        {
          senderId: parties[1].id,
          senderName: parties[1].name,
        }
      );
    });
  });

  it('render component - edit mode', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    render(
      <AddSpecialContactDialog
        open
        value="mocked@pec.it"
        sender={{ senderId: parties[0].id, senderName: parties[0].name }}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />,
      {
        preloadedState: { contactsState: { digitalAddresses } },
      }
    );
    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(`special-contacts.modal-title`);
    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(`special-contacts.pec`);
    const input = getById(bodyEl, 's_value');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const senderAutoComplete = within(bodyEl).getByTestId('sender');
    expect(senderAutoComplete).toBeInTheDocument();
    const alreadyExistsAlert = within(bodyEl).queryByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).not.toBeInTheDocument();
    const cancelButton = within(dialog).getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    const confirmButton = within(dialog).getByText('button.associa');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
  });

  it('edit address', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    render(
      <AddSpecialContactDialog
        open
        value="mocked@pec.it"
        sender={{ senderId: parties[0].id, senderName: parties[0].name }}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />,
      {
        preloadedState: { contactsState: { digitalAddresses } },
      }
    );
    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const bodyEl = within(dialog).getByTestId('dialog-content');
    const input = getById(bodyEl, 's_value');
    // fill with invalid value
    fireEvent.change(input, { target: { value: 'invalid value' } });
    await waitFor(() => {
      expect(input).toHaveValue('invalid value');
    });
    const errorMessage = getById(bodyEl, `s_value-helper-text`);
    expect(errorMessage).toBeInTheDocument();
    const confirmButton = within(dialog).getByText('button.associa');
    expect(confirmButton).toBeDisabled();
    // fill with valid value
    fireEvent.change(input, { target: { value: 'mocked-modified@pec.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('mocked-modified@pec.it');
    });
    expect(errorMessage).not.toBeInTheDocument();
    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(1);
      expect(confirmHandler).toHaveBeenCalledWith(
        'mocked-modified@pec.it',
        ChannelType.PEC,
        AddressType.LEGAL,
        {
          senderId: parties[0].id,
          senderName: parties[0].name,
        }
      );
    });
  });

  it('show already exist message', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    const specialAddresses = digitalAddresses.filter(
      (a) => a.senderId !== 'default' && a.channelType === ChannelType.EMAIL
    );
    render(
      <AddSpecialContactDialog
        open
        value=""
        sender={{ senderId: 'default', senderName: '' }}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />,
      {
        preloadedState: { contactsState: { digitalAddresses } },
      }
    );
    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const bodyEl = within(dialog).getByTestId('dialog-content');

    const input = getById(bodyEl, 's_value');
    fireEvent.change(input, { target: { value: 'test@test.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('test@test.it');
    });

    await testSelect(
      bodyEl,
      'channelType',
      [
        { value: ChannelType.EMAIL, label: 'special-contacts.email' },
        { value: ChannelType.SMS, label: 'special-contacts.sms' },
        { value: ChannelType.PEC, label: 'special-contacts.pec' },
        { value: ChannelType.SERCQ, label: 'special-contacts.sercq' },
      ],
      0
    );

    await testAutocomplete(
      bodyEl,
      'sender',
      parties,
      true,
      parties.findIndex((p) => p.name === specialAddresses[0].senderName),
      true
    );

    const alreadyExistsAlert = within(bodyEl).getByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).toBeInTheDocument();
  });

  it('should show only EMAIL and SMS on channelType dropdown if there are no default PEC and SERCQ', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    const addresses = digitalAddresses.filter(
      (a) =>
        a.senderId === 'default' &&
        a.channelType !== ChannelType.PEC &&
        a.channelType !== ChannelType.SERCQ
    );
    render(
      <AddSpecialContactDialog
        open
        value=""
        sender={{ senderId: 'default', senderName: '' }}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />,
      {
        preloadedState: { contactsState: { digitalAddresses: addresses } },
      }
    );

    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const bodyEl = within(dialog).getByTestId('dialog-content');

    await testSelect(
      bodyEl,
      'channelType',
      [
        { value: ChannelType.EMAIL, label: 'special-contacts.email' },
        { value: ChannelType.SMS, label: 'special-contacts.sms' },
        { value: ChannelType.PEC, label: 'special-contacts.pec' },
      ],
      0
    );
  });

  it.only('should show all channelType options if PEC is default address and no default SERCQ is present', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    const addresses = digitalAddresses.filter(
      (a) => a.senderId === 'default' && a.channelType !== ChannelType.SERCQ
    );
    render(
      <AddSpecialContactDialog
        open
        value=""
        sender={{ senderId: 'default', senderName: '' }}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />,
      {
        preloadedState: { contactsState: { digitalAddresses: addresses } },
      }
    );

    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const bodyEl = within(dialog).getByTestId('dialog-content');

    await testSelect(
      bodyEl,
      'channelType',
      [
        { value: ChannelType.EMAIL, label: 'special-contacts.email' },
        { value: ChannelType.SMS, label: 'special-contacts.sms' },
        { value: ChannelType.PEC, label: 'special-contacts.pec' },
        { value: ChannelType.SERCQ, label: 'special-contacts.sercq' },
      ],
      0
    );
  });

  it('should show item disabled if default address is not present', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    const addresses = digitalAddresses.filter(
      (a) => a.senderId === 'default' && a.channelType !== ChannelType.EMAIL
    );
    render(
      <AddSpecialContactDialog
        open
        value=""
        sender={{ senderId: 'default', senderName: '' }}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />,
      {
        preloadedState: { contactsState: { digitalAddresses: addresses } },
      }
    );

    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const bodyEl = within(dialog).getByTestId('dialog-content');

    const selectButton = bodyEl.querySelector(
      `div[id="channelType"], div[data-testid="channelType"] [role="combobox"]`
    );
    fireEvent.mouseDown(selectButton!);
    const selectOptionsContainer = screen.getByRole('presentation');
    expect(selectOptionsContainer).toBeInTheDocument();
    const selectOptionsList = within(selectOptionsContainer).getByRole('listbox');
    expect(selectOptionsList).toBeInTheDocument();
    const selectOptionsListItems = within(selectOptionsList).getAllByRole('option');
    expect(selectOptionsListItems).toHaveLength(4);

    selectOptionsListItems.forEach((opt) => {
      if (opt.textContent === 'special-contacts.email') {
        expect(opt).toBeDisabled();
      } else {
        expect(opt).not.toBeDisabled();
      }
    });
  });

  it('API error', async () => {
    mock.onGet('/bff/v1/pa-list').reply(500);
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <AddSpecialContactDialog
            open
            value=""
            sender={{ senderId: 'mocked-sender-id', senderName: 'mocked-sender-name' }}
            channelType={ChannelType.PEC}
            onDiscard={discardHandler}
            onConfirm={confirmHandler}
          />
        </>,
        {
          preloadedState: { contactsState: { digitalAddresses } },
        }
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
