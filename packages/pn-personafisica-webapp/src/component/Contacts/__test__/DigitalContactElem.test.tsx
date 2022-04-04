import { fireEvent, waitFor } from '@testing-library/react';
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

describe('DigitalContactElem Component', () => {
  it('renders DigitalContactElem (no edit mode)', () => {
    // render component
    const result = render(<DigitalContactElem fields={fields} />);
    expect(result.container).toHaveTextContent('Campo 1');
    expect(result.container).toHaveTextContent('Campo 2');
    const input = result.queryByTestId('field');
    expect(input).not.toBeInTheDocument();
    const buttons = result.container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('button.rimuovi');
    expect(buttons[1]).toHaveTextContent('button.modifica');
  });

  it('renders DigitalContactElem (edit mode)', async () => {
    // render component
    const result = render(<DigitalContactElem fields={fields} />);
    const buttons = result.container.querySelectorAll('button');
    fireEvent.click(buttons[1]);
    await waitFor(() => {
      const input = result.queryByTestId('field');
      expect(input).toBeInTheDocument();
      const newButtons = result.container.querySelectorAll('button');
      expect(newButtons).toHaveLength(1);
      expect(newButtons[0]).toHaveTextContent('button.salva');
    })
  });
});
