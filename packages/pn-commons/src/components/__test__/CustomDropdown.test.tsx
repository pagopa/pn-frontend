import { render, testSelect } from '../../test-utils';
import CustomDropdown from '../CustomDropdown';
import MenuItem from '@mui/material/MenuItem';

const mockDropdownItems = [
  { key: 'mock-id-1', value: 'mock-value-1', label: 'mock-label-1' },
  { key: 'mock-id-2', value: 'mock-value-2', label: 'mock-label-2' },
  { key: 'mock-id-3', value: 'mock-value-3', label: 'mock-label-3' },
  { key: 'mock-id-4', value: 'mock-value-4', label: 'mock-label-4' },
];

describe('CustomDropdown component', () => {
  it('renders with items list, test select', async () => {
    const result = render(
      <CustomDropdown
        name="mock-dropdown-name"
        id="mock-dropdown-name"
        label="mock-dropdown-label"
        value=""
      >
        {mockDropdownItems.map((mockItem) => (
          <MenuItem key={mockItem.key} value={mockItem.value}>
            {mockItem.label}
          </MenuItem>
        ))}
      </CustomDropdown>
    );
    await testSelect(result.container!, 'mock-dropdown-name', mockDropdownItems, 2);
  });

  it('renders without items', async () => {
    const result = render(
      <CustomDropdown
        name="mock-dropdown-name"
        id="mock-dropdown-name"
        label="mock-dropdown-label"
        value=""
      />
    );
    const input = await result.findByPlaceholderText(/Non ci sono elementi/i);
    expect(input).toBeInTheDocument();
  });
});
