import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { ChannelType } from '../../../models/contacts';
import DigitalContactElem from '../DigitalContactElem';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const mockEditCancelCbk = vi.fn();
const mockEditConfirmCbk = vi.fn();
const mockDeleteCbk = vi.fn();

/*
In questo test viene testato solo il rendering dei componenti e non il flusso.
Il flusso completo viene testato nei singoli componenti, dove si potrà testare anche il cambio di stato di redux e le api.
Per questo motivo non è necessario mockare le api, ma va bene anche usare lo spyOn.

Andrea Cimini - 6/09/2023
*/
describe('DigitalContactElem Component', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
    mock.reset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    mock.restore();
  });

  it('renders component', () => {
    // render component
    const { container, queryByTestId } = render(
      <DigitalContactElem
        inputProps={{
          id: 'pec',
          name: 'pec',
          label: 'PEC',
          value: 'mocked@pec.it',
        }}
        senderId="mocked-senderId"
        contactType={ChannelType.PEC}
        onEditCancel={mockEditCancelCbk}
        onDelete={mockDeleteCbk}
        editManagedFromOutside
      />
    );
    expect(container).toHaveTextContent('mocked@pec.it');
    const input = queryByTestId('pec');
    expect(input).not.toBeInTheDocument();
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('button.modifica');
    expect(buttons[1]).toHaveTextContent('button.elimina');
  });

  it('edits contact', async () => {
    // render component
    const { container } = render(
      <form onSubmit={mockEditConfirmCbk}>
        <DigitalContactElem
          inputProps={{
            id: 'pec',
            name: 'pec',
            label: 'PEC',
            value: 'mocked@pec.it',
          }}
          senderId="mocked-senderId"
          contactType={ChannelType.PEC}
          onEditCancel={mockEditCancelCbk}
          onDelete={mockDeleteCbk}
          editManagedFromOutside
        />
      </form>
    );
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    let input = await waitFor(() => container.querySelector('[name="pec"]'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const newButtons = container.querySelectorAll('button');
    expect(newButtons).toHaveLength(2);
    expect(newButtons[0]).toHaveTextContent('button.salva');
    expect(newButtons[1]).toHaveTextContent('button.annulla');
    // cancel edit
    fireEvent.click(newButtons![1]);
    await waitFor(() => {
      expect(mockEditCancelCbk).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    // confirm edit
    fireEvent.click(buttons![0]);
    input = await waitFor(() => container.querySelector('[name="pec"]'));
    fireEvent.click(newButtons![0]);
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    expect(mockEditConfirmCbk).toHaveBeenCalledTimes(1);
  });

  it('remove contact', () => {
    // render component
    const { container } = render(
      <DigitalContactElem
        inputProps={{
          id: 'pec',
          name: 'pec',
          label: 'PEC',
          value: 'mocked@pec.it',
        }}
        senderId="mocked-senderId"
        contactType={ChannelType.PEC}
        onEditCancel={mockEditCancelCbk}
        onDelete={mockDeleteCbk}
        editManagedFromOutside
      />
    );
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[1]);
    expect(mockDeleteCbk).toHaveBeenCalledTimes(1);
  });

  it('save disabled', async () => {
    // render component
    const { container } = render(
      <DigitalContactElem
        inputProps={{
          id: 'pec',
          name: 'pec',
          label: 'PEC',
          value: 'mocked@pec.it',
        }}
        senderId="mocked-senderId"
        contactType={ChannelType.PEC}
        onEditCancel={mockEditCancelCbk}
        saveDisabled
        onDelete={mockDeleteCbk}
        editManagedFromOutside
      />
    );
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const newButtons = await waitFor(() => container.querySelectorAll('button'));
    expect(newButtons).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeDisabled();
    expect(newButtons![1]).toHaveTextContent('button.annulla');
  });

  it('edit disabled', () => {
    // render component
    const { container } = render(
      <DigitalContactElem
        inputProps={{
          id: 'pec',
          name: 'pec',
          label: 'PEC',
          value: 'mocked@pec.it',
        }}
        senderId="mocked-senderId"
        contactType={ChannelType.PEC}
        onEditCancel={mockEditCancelCbk}
        editDisabled
        onDelete={mockDeleteCbk}
        editManagedFromOutside
      />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![0]).toBeDisabled();
    expect(buttons![1]).toHaveTextContent('button.elimina');
  });
});
