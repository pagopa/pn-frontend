import { render, testSelect, mockDropdownItems } from "../../test-utils";
import CustomDropdown from "../CustomDropdown";

describe('CustomDropdown component', () => {
  let form: HTMLFormElement | undefined;

  it('renders with items list, test select', async () => {
    const result = render(<CustomDropdown name="mock-dropdown-name" id="mock-dropdown-name" items={mockDropdownItems} label='mock-dropdown-label'/>);
    await testSelect(result.container!, 'mock-dropdown-name', mockDropdownItems, 2);
  });

  it('renders without items', async () => {
    const result = render(<CustomDropdown name="mock-dropdown-name" id="mock-dropdown-name" items={[]} label='mock-dropdown-label'/>);
    const input = await result.findByPlaceholderText(/Non ci sono elementi/i);
    expect(input).toBeInTheDocument();
  });
});