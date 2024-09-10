import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';
import { getById, testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';
import { fireEvent, waitFor } from '@testing-library/react';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { act, render, screen, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { ChannelType } from '../../../models/contacts';
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
        sender={{ id: 'default', name: '' }}
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
        sender={{ id: 'default', name: '' }}
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
    fireEvent.change(input, { target: { value: 'mocked@pec.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('mocked@pec.it');
    });
    expect(errorMessage).not.toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    // select sender
    await testAutocomplete(bodyEl, 'sender', parties, true, 1, true);
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(1);
      expect(confirmHandler).toHaveBeenCalledWith('mocked@pec.it', ChannelType.PEC, parties[1]);
    });
  });

  it('render component - edit mode', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    render(
      <AddSpecialContactDialog
        open
        value="mocked@pec.it"
        sender={parties[0]}
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
        sender={parties[0]}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />
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
        parties[0]
      );
    });
  });

  // TODO: Capire come gestire l'alreadyExists
  it.skip('show already exist message', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    render(
      <AddSpecialContactDialog
        open
        value=""
        sender={{ id: 'default', name: '' }}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
      />
    );
    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const bodyEl = within(dialog).getByTestId('dialog-content');
    const input = getById(bodyEl, 's_value');
    // fill with valid value
    fireEvent.change(input, { target: { value: 'mocked@pec.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('mocked@pec.it');
    });
    // select sender
    await testAutocomplete(bodyEl, 'sender', parties, true, 0, true);
    const senderChips = within(bodyEl).queryAllByTestId('sender_chip');
    expect(senderChips).toHaveLength(1);
    expect(senderChips[0]).toHaveTextContent(parties[0].name);
    const alreadyExistsAlert = within(bodyEl).getByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).toBeInTheDocument();
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
            sender={{ id: 'mocked-sender-id', name: 'mocked-sender-name' }}
            channelType={ChannelType.PEC}
            onDiscard={discardHandler}
            onConfirm={confirmHandler}
          />
        </>
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
