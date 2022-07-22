import { fireEvent, screen, waitFor } from '@testing-library/react';

import { render } from '../../../test-utils';
import StatusTooltip from "../StatusTooltip";

const tooltip = 'mocked tooltip test';
const label = 'mocked label';
const classRoot = 'MuiChip-color';
const mockEventTrackingCallback = jest.fn();

async function testStatusTooltip(color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary') {
  render(<StatusTooltip tooltip={tooltip} label={label} color={color} eventTrackingCallback={mockEventTrackingCallback}/>);
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent(/mocked label/i);
  const buttonClass = `${classRoot}${color.charAt(0).toUpperCase() + color.slice(1)}`;
  expect(button.classList.contains(buttonClass)).toBe(true);
  fireEvent.mouseOver(button);
  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(/mocked tooltip test/i)
    expect(mockEventTrackingCallback).toBeCalledTimes(1);
  });
}

describe('Status Tooltip Component', () => {
  it('renders status tooltip (warning)', () => {
    testStatusTooltip('warning');
  });

  it('renders status tooltip (error)', () => {
    testStatusTooltip('error');
  });

  it('renders status tooltip (success)', () => {
    testStatusTooltip('success');
  });

  it('renders status tooltip (info)', () => {
    testStatusTooltip('info');
  });

  it('renders status tooltip (default)', () => {
    testStatusTooltip('default');
  });

  it('renders status tooltip (primary)', () => {
    testStatusTooltip('primary');
  });

  it('renders status tooltip (secondary)', () => {
    testStatusTooltip('secondary');
  });
});