import { fireEvent, RenderResult, waitFor, screen } from '@testing-library/react';
import { TextField } from '@mui/material';

import { render } from '../../../__test__/test-utils';
import DigitalContactElem from '../DigitalContactElem';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

const fields = [
  {
    id: '1',
    component: 'Campo 1',
    size: 'variable' as ('variable' | 'auto'),
  },
  {
    id: '2',
    component: (
      <TextField
        id="campo-2"
        fullWidth
        name="campo-2"
        label="campo-2"
        variant="outlined"
        size="small"
        value="Campo 2"
        data-testid="field"
      ></TextField>
    ),
    size: 'auto' as ('variable' | 'auto'),
    isEditable: true
  },
];

const removeHandlerMock = jest.fn();

describe('DigitalContactElem Component', () => {
  let result: RenderResult | undefined;

  beforeEach(() => {
    // render component
    result = render(<DigitalContactElem fields={fields} removeModalTitle="mocked-title" removeModalBody="mocked-body" onRemoveClick={removeHandlerMock}/>);
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders DigitalContactElem (no edit mode)', () => {
    expect(result?.container).toHaveTextContent('Campo 1');
    expect(result?.container).toHaveTextContent('Campo 2');
    const input = result?.queryByTestId('field');
    expect(input).not.toBeInTheDocument();
    const buttons = result?.container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.rimuovi');
    expect(buttons![1]).toHaveTextContent('button.modifica');
  });

  it('renders DigitalContactElem (edit mode)', async () => {
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      const input = result?.queryByTestId('field');
      expect(input).toBeInTheDocument();
      const newButtons = result?.container.querySelectorAll('button');
      expect(newButtons).toHaveLength(1);
      expect(newButtons![0]).toHaveTextContent('button.salva');
    });
  });

  it('shows remove modal', async () => {
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const dialog = await waitFor(() => screen.queryByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('mocked-title');
    expect(dialog).toHaveTextContent('mocked-body');
    const dialogButtons = dialog?.querySelectorAll('button');
    expect(dialogButtons).toHaveLength(2);
    expect(dialogButtons![0]).toHaveTextContent('button.annulla');
    expect(dialogButtons![1]).toHaveTextContent('button.conferma');
  });

  it('closes remove modal (clicks on cancel)', async () => {
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const dialog = await waitFor(() => screen.queryByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    const dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![0]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('closes remove modal (clicks on confirm)', async () => {
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const dialog = await waitFor(() => screen.queryByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    const dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(removeHandlerMock).toBeCalledTimes(1);
      expect(removeHandlerMock).toBeCalledWith();
    });
  });
});
