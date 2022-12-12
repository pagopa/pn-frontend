import { render, testSelect, mockDropdownItems } from '../../test-utils';
import CustomDropdown from '../CustomDropdown';
import MenuItem from '@mui/material/MenuItem';

describe('CustomDropdown component', () => {
  it('renders with items list, test select', async () => {
    const result = render(
      <CustomDropdown name="mock-dropdown-name" id="mock-dropdown-name" label="mock-dropdown-label" value="">
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
