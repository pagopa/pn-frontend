import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';
import { getById, testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';
import { fireEvent, waitFor } from '@testing-library/react';

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
        senders={[]}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
        digitalAddresses={[]}
      />
    );
    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(`special-contacts.modal-pec-title`);
    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(`special-contacts.pec`);
    const input = getById(bodyEl, 's_value');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(bodyEl).toHaveTextContent(`special-contacts.senders-to-add`);
    expect(bodyEl).toHaveTextContent(`special-contacts.senders-caption`);
    const senderAutoComplete = within(bodyEl).getByTestId('sender');
    expect(senderAutoComplete).toBeInTheDocument();
    const senderChips = within(bodyEl).queryAllByTestId('sender_chip');
    expect(senderChips).toHaveLength(0);
    const alreadyExistsAlert = within(bodyEl).queryByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).not.toBeInTheDocument();
    const cancelButton = within(dialog).getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    const confirmButton = within(dialog).getByText('button.conferma');
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
        senders={[]}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
        digitalAddresses={[]}
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
    const confirmButton = within(dialog).getByText('button.conferma');
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
    const senderChips = within(bodyEl).queryAllByTestId('sender_chip');
    expect(senderChips).toHaveLength(1);
    expect(senderChips[0]).toHaveTextContent(parties[1].name);
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(1);
      expect(confirmHandler).toHaveBeenCalledWith('mocked@pec.it', [parties[1]]);
    });
  });

  it('render component - edit mode', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    render(
      <AddSpecialContactDialog
        open
        value="mocked@pec.it"
        senders={[parties[0], parties[2]]}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
        digitalAddresses={[]}
      />
    );
    const dialog = await waitFor(() => screen.getByTestId('addSpecialContactDialog'));
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(`special-contacts.modal-pec-title`);
    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(`special-contacts.pec`);
    const input = getById(bodyEl, 's_value');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    expect(bodyEl).toHaveTextContent(`special-contacts.senders-to-add`);
    expect(bodyEl).toHaveTextContent(`special-contacts.senders-caption`);
    const senderAutoComplete = within(bodyEl).getByTestId('sender');
    expect(senderAutoComplete).toBeInTheDocument();
    const senderChips = within(bodyEl).getAllByTestId('sender_chip');
    expect(senderChips).toHaveLength(2);
    expect(senderChips[0]).toHaveTextContent(parties[0].name);
    expect(senderChips[1]).toHaveTextContent(parties[2].name);
    const alreadyExistsAlert = within(bodyEl).queryByTestId('alreadyExistsAlert');
    expect(alreadyExistsAlert).not.toBeInTheDocument();
    const cancelButton = within(dialog).getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    const confirmButton = within(dialog).getByText('button.conferma');
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
        senders={[parties[0], parties[2]]}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
        digitalAddresses={[]}
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
    const confirmButton = within(dialog).getByText('button.conferma');
    expect(confirmButton).toBeDisabled();
    // fill with valid value
    fireEvent.change(input, { target: { value: 'mocked-modified@pec.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('mocked-modified@pec.it');
    });
    expect(errorMessage).not.toBeInTheDocument();
    expect(confirmButton).toBeEnabled();
    // remove one sender
    let senderChips = within(bodyEl).queryAllByTestId('sender_chip');
    const cancelIcon = within(senderChips[0]).getByTestId('CancelIcon');
    fireEvent.click(cancelIcon);
    senderChips = await waitFor(() => within(bodyEl).queryAllByTestId('sender_chip'));
    expect(senderChips).toHaveLength(1);
    expect(senderChips[0]).toHaveTextContent(parties[2].name);
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(1);
      expect(confirmHandler).toHaveBeenCalledWith('mocked-modified@pec.it', [parties[2]]);
    });
  });

  it('show already exist message', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    render(
      <AddSpecialContactDialog
        open
        value=""
        senders={[]}
        channelType={ChannelType.PEC}
        onDiscard={discardHandler}
        onConfirm={confirmHandler}
        digitalAddresses={[
          {
            value: 'another-mocked@pec.it',
            addressType: AddressType.LEGAL,
            channelType: ChannelType.PEC,
            senders: [{ senderId: parties[0].id, senderName: parties[0].name }],
          },
        ]}
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
            senders={[]}
            channelType={ChannelType.PEC}
            onDiscard={discardHandler}
            onConfirm={confirmHandler}
            digitalAddresses={[]}
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
