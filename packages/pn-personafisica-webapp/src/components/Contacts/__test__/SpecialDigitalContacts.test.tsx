import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById, testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { ChannelType } from '../../../models/contacts';
import SpecialDigitalContacts from '../SpecialDigitalContacts';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const deleteHandler = vi.fn();
const confirmHandler = vi.fn();

const specialAddresses = digitalAddresses.filter(
  (addr) => addr.senderId !== 'default' && addr.channelType === ChannelType.PEC
);

// TODO: questi test andranno rivisti una volta che saranno disponibili le api bulk
describe('SpecialDigitalContacts Component', async () => {
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

  it('renders component - no contacts', () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, queryAllByTestId } = render(
      <SpecialDigitalContacts
        channelType={ChannelType.PEC}
        digitalAddresses={[]}
        onConfirm={confirmHandler}
        onDelete={deleteHandler}
      />
    );
    expect(container).toHaveTextContent(`special-contacts.pec-add-more-caption`);
    const button = within(container).getByTestId('addMoreButton');
    expect(button).toHaveTextContent(`special-contacts.pec-add-more-button`);
    // contacts list
    const specialContactForms = queryAllByTestId(`special_pec`);
    expect(specialContactForms).toHaveLength(0);
  });

  it('add new address', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, getByTestId } = render(
      <SpecialDigitalContacts
        channelType={ChannelType.PEC}
        digitalAddresses={[]}
        onConfirm={confirmHandler}
        onDelete={deleteHandler}
      />
    );
    const button = within(container).getByTestId('addMoreButton');
    fireEvent.click(button);
    const addSpecialContactDialog = await waitFor(() => getByTestId('addSpecialContactDialog'));
    expect(addSpecialContactDialog).toBeInTheDocument();
    // fill input
    const input = getById(addSpecialContactDialog, 's_value');
    fireEvent.change(input, { target: { value: 'mocked@pec.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('mocked@pec.it');
    });
    // select sender
    await testAutocomplete(addSpecialContactDialog, 'sender', parties, true, 1, true);
    const confirmButton = within(addSpecialContactDialog).getByText('button.conferma');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(1);
      expect(confirmHandler).toHaveBeenCalledWith('mocked@pec.it', {
        senderId: parties[1].id,
        senderName: parties[1].name,
      });
    });
    await waitFor(() => {
      expect(addSpecialContactDialog).not.toBeInTheDocument();
    });
  });

  it('renders component - with contacts', () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { container, getAllByTestId } = render(
      <SpecialDigitalContacts
        channelType={ChannelType.PEC}
        digitalAddresses={specialAddresses}
        onConfirm={confirmHandler}
        onDelete={deleteHandler}
      />
    );
    expect(container).toHaveTextContent(`special-contacts.pec-add-more-caption`);
    const button = within(container).getByTestId('addMoreButton');
    expect(button).toHaveTextContent(`special-contacts.pec-add-more-button`);
    // contacts list
    const specialContactForms = getAllByTestId(`special_pec`);
    expect(specialContactForms).toHaveLength(specialAddresses.length);
    specialContactForms.forEach((contactField, index) => {
      expect(contactField).toHaveTextContent(specialAddresses[index].value);
      const editButton = within(contactField).getByTestId(`modifyContact-special_pec`);
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveTextContent('button.modifica');
      const deleteButton = within(contactField).getByTestId(`cancelContact-special_pec`);
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveTextContent('button.elimina');
      expect(contactField).toHaveTextContent(`special-contacts.sender-list`);
      expect(contactField).toHaveTextContent(specialAddresses[index].senderName!);
    });
  });

  it('edit address', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { getByTestId, getAllByTestId } = render(
      <SpecialDigitalContacts
        channelType={ChannelType.PEC}
        digitalAddresses={specialAddresses}
        onConfirm={confirmHandler}
        onDelete={deleteHandler}
      />
    );
    const specialContactForms = getAllByTestId(`special_pec`);
    const editButton = within(specialContactForms[0]).getByTestId(`modifyContact-special_pec`);
    fireEvent.click(editButton);
    const addSpecialContactDialog = await waitFor(() => getByTestId('addSpecialContactDialog'));
    expect(addSpecialContactDialog).toBeInTheDocument();
    // edit input
    const input = getById(addSpecialContactDialog, 's_value');
    expect(input).toHaveValue(specialAddresses[0].value);
    fireEvent.change(input, { target: { value: 'mocked@pec.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('mocked@pec.it');
    });
    // edit sender
    const senderChips = within(addSpecialContactDialog).queryAllByTestId('sender_chip');
    expect(senderChips).toHaveLength(1);
    expect(senderChips[0]).toHaveTextContent(specialAddresses[0].senderName!);
    await testAutocomplete(addSpecialContactDialog, 'sender', parties, true, 1, true);
    // confirm
    const confirmButton = within(addSpecialContactDialog).getByText('button.conferma');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(confirmHandler).toHaveBeenCalledTimes(1);
      expect(confirmHandler).toHaveBeenCalledWith('mocked@pec.it', {
        senderId: parties[0].id,
        senderName: parties[0].name,
      });
    });
    await waitFor(() => {
      expect(addSpecialContactDialog).not.toBeInTheDocument();
    });
  });

  it('delete address', () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    // render component
    const { getAllByTestId } = render(
      <SpecialDigitalContacts
        channelType={ChannelType.PEC}
        digitalAddresses={specialAddresses}
        onConfirm={confirmHandler}
        onDelete={deleteHandler}
      />
    );
    const specialContactForms = getAllByTestId(`special_pec`);
    const deleteButton = within(specialContactForms[0]).getByTestId(`cancelContact-special_pec`);
    fireEvent.click(deleteButton);
    expect(deleteHandler).toHaveBeenCalledTimes(1);
    expect(deleteHandler).toHaveBeenCalledWith(specialAddresses[0].value, {
      senderId: specialAddresses[0].senderId,
      senderName: specialAddresses[0].senderName,
    });
  });
});
