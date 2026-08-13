import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import StatusTooltip from '../StatusTooltip';

const tooltip = 'mocked tooltip test';
const label = 'mocked label';
const colors = ['warning', 'error', 'success', 'info', 'default', 'highlight', 'neutral'] as const;

describe('Status Tooltip Component', () => {
  it.each(colors)('renders status tooltip (%s)', async (color) => {
    const { getByTestId } = render(<StatusTooltip tooltip={tooltip} label={label} color={color} />);
    const button = getByTestId(`statusChip-${label}`);
    expect(button).toHaveTextContent(/mocked label/i);
    // MIChip espone id e data-testid stabili, indipendenti dal color
    expect(button).toHaveAttribute('id', `status-chip-${label}`);
    fireEvent.mouseOver(button);
    const ttip = await waitFor(() => screen.getByRole('tooltip'));
    expect(ttip).toHaveTextContent(/mocked tooltip test/i);
  });
});
