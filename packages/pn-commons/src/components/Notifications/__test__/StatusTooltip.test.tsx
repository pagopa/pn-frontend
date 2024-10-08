import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import StatusTooltip from '../StatusTooltip';

const tooltip = 'mocked tooltip test';
const label = 'mocked label';
const classRoot = 'MuiChip-color';
const colors = ['warning', 'error', 'success', 'info', 'default', 'primary', 'secondary'] as const;

describe('Status Tooltip Component', () => {
  it.each(colors)('renders status tooltip (%s)', async (color) => {
    const { getByRole } = render(<StatusTooltip tooltip={tooltip} label={label} color={color} />);
    const button = getByRole('button');
    expect(button).toHaveTextContent(/mocked label/i);
    const buttonClass = `${classRoot}${color.charAt(0).toUpperCase() + color.slice(1)}`;
    expect(button.classList.contains(buttonClass)).toBe(true);
    fireEvent.mouseOver(button);
    const ttip = await waitFor(() => screen.getByRole('tooltip'));
    expect(ttip).toHaveTextContent(/mocked tooltip test/i);
  });
});
