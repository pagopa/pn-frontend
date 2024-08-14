import { useRef } from 'react';
import { vi } from 'vitest';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import EditDigitalContact from '../EditDigitalContact';

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

describe('EditDigitalContact Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders component', () => {
    // render component
    const { container, queryByTestId } = render(
      <EditDigitalContact
        inputProps={{
          id: 'pec',
          name: 'pec',
          label: 'PEC',
          value: 'mocked@pec.it',
        }}
        senderId="mocked-senderId"
        onEditCancel={mockEditCancelCbk}
        onDelete={mockDeleteCbk}
      />
    );
    expect(container).toHaveTextContent('mocked@pec.it');
    const input = queryByTestId('pec');
    expect(input).not.toBeInTheDocument();
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![1]).toHaveTextContent('button.elimina');
  });

  it('edits contact', async () => {
    const Component = () => {
      const digitalElemRef = useRef<{ editContact: () => void; toggleEdit: () => void }>({
        editContact: () => {},
        toggleEdit: () => {},
      });
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mockEditConfirmCbk();
            digitalElemRef.current.toggleEdit();
          }}
        >
          <EditDigitalContact
            inputProps={{
              id: 'pec',
              name: 'pec',
              label: 'PEC',
              value: 'mocked@pec.it',
            }}
            senderId="mocked-senderId"
            onEditCancel={mockEditCancelCbk}
            onDelete={mockDeleteCbk}
            ref={digitalElemRef}
          />
        </form>
      );
    };
    // render component
    const { container } = render(<Component />);
    let buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    let input = await waitFor(() => container.querySelector('[name="pec"]'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    let newButtons = container.querySelectorAll('button');
    expect(newButtons).toHaveLength(2);
    expect(newButtons[0]).toHaveTextContent('button.salva');
    expect(newButtons[1]).toHaveTextContent('button.annulla');
    // cancel edit
    fireEvent.click(newButtons[1]);
    await waitFor(() => {
      expect(mockEditCancelCbk).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    // confirm edit
    buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    input = await waitFor(() => container.querySelector('[name="pec"]'));
    expect(input).toBeInTheDocument();
    newButtons = container.querySelectorAll('button');
    fireEvent.click(newButtons[0]);
    expect(mockEditConfirmCbk).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
  });

  it('remove contact', () => {
    // render component
    const { container } = render(
      <EditDigitalContact
        inputProps={{
          id: 'pec',
          name: 'pec',
          label: 'PEC',
          value: 'mocked@pec.it',
        }}
        senderId="mocked-senderId"
        onEditCancel={mockEditCancelCbk}
        onDelete={mockDeleteCbk}
      />
    );
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[1]);
    expect(mockDeleteCbk).toHaveBeenCalledTimes(1);
  });

  it('save disabled', async () => {
    // render component
    const { container } = render(
      <EditDigitalContact
        inputProps={{
          id: 'pec',
          name: 'pec',
          label: 'PEC',
          value: 'mocked@pec.it',
        }}
        senderId="mocked-senderId"
        onEditCancel={mockEditCancelCbk}
        saveDisabled
        onDelete={mockDeleteCbk}
      />
    );
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    const newButtons = await waitFor(() => container.querySelectorAll('button'));
    expect(newButtons).toHaveLength(2);
    expect(newButtons[0]).toHaveTextContent('button.salva');
    expect(newButtons[0]).toBeDisabled();
    expect(newButtons[1]).toHaveTextContent('button.annulla');
  });

  it('edit disabled', () => {
    // render component
    const { container } = render(
      <EditDigitalContact
        inputProps={{
          id: 'pec',
          name: 'pec',
          label: 'PEC',
          value: 'mocked@pec.it',
        }}
        senderId="mocked-senderId"
        onEditCancel={mockEditCancelCbk}
        editDisabled
        onDelete={mockDeleteCbk}
      />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('button.modifica');
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toHaveTextContent('button.elimina');
  });
});
