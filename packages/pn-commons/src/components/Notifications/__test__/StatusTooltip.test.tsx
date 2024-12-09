import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import StatusTooltip from '../StatusTooltip';

const tooltip = 'mocked tooltip test';
const label = 'mocked label';
const classRoot = 'MuiChip-color';
const colors = ['warning', 'error', 'success', 'info', 'default', 'primary', 'secondary'] as const;

describe('Status Tooltip Component', () => {
  it.each(colors)('renders status tooltip (%s)', async (color) => {
    const { getByTestId } = render(<StatusTooltip tooltip={tooltip} label={label} color={color} />);
    const button = getByTestId(`statusChip-${label}`);
    expect(button).toHaveTextContent(/mocked label/i);
    expect(button).not.toHaveAttribute('role','button'); //For A11Y
    const buttonClass = `${classRoot}${color.charAt(0).toUpperCase() + color.slice(1)}`;
    expect(button.classList.contains(buttonClass)).toBe(true);
    fireEvent.mouseOver(button);
    const ttip = await waitFor(() => screen.getByRole('tooltip'));
    expect(ttip).toHaveTextContent(/mocked tooltip test/i);
  });
});
