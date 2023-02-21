import { render } from "../../test-utils";
import DisclaimerModal from "../DisclaimerModal";
import userEvent from "@testing-library/user-event";

const mockConfirm = jest.fn()
const mockCancel = jest.fn()

describe('DisclaimerModal tests', () => {
  it('checks that the modal renders correctly', () => {
    const result = render(
      <DisclaimerModal
        open={true}
        onConfirm={mockConfirm} onCancel={mockCancel}
        confirmLabel={'Conferma'}
        content={'test content'}
      />);

    expect(result.baseElement).toHaveTextContent('test content');
    expect(result.baseElement).toHaveTextContent('Ho capito')
  })

  it('checks that callback functions are called correctly when clicking on buttons', async () => {
    const result = render(
      <DisclaimerModal
        open={true}
        onConfirm={mockConfirm} onCancel={mockCancel}
        confirmLabel={'Conferma'}
      />);

    const cancelButton = result.getByRole('button', { name: 'Annulla' })
    const confirmButton = result.getByRole('button', { name: 'Conferma' })
    const checkbox = result.getByRole('checkbox')

    await userEvent.click(cancelButton);

    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    expect(mockCancel).toBeCalledTimes(1);
    expect(mockConfirm).toBeCalledTimes(0);

    await userEvent.click(checkbox);
    expect(confirmButton).toBeEnabled();
    await userEvent.click(confirmButton);
    expect(mockConfirm).toBeCalledTimes(1);
  })
})