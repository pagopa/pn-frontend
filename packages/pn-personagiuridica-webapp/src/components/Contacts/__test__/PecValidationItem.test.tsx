import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import PecValidationItem from '../PecValidationItem';

const cancelValidationHandler = vi.fn();

describe('PecValidationItem Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - confirmation modal visible', () => {
    // render component
    const { getByTestId, getByText } = render(
      <PecValidationItem senderId="1234" onCancelValidation={cancelValidationHandler} />
    );

    const pecValidationItem = getByTestId('1234_pecContact');
    expect(pecValidationItem).toBeInTheDocument();
    const closeIcon = getByTestId('CloseIcon');
    expect(closeIcon).toBeInTheDocument();
    const cancelValidationButton = getByText('legal-contacts.cancel-pec-validation');
    expect(cancelValidationButton).toBeInTheDocument();
  });

  it('click on cancel validation button', () => {
    // render component
    const { getByTestId } = render(
      <PecValidationItem senderId="1234" onCancelValidation={cancelValidationHandler} />
    );
    const cancelValidationButton = getByTestId('cancelValidation');
    fireEvent.click(cancelValidationButton);
    expect(cancelValidationHandler).toHaveBeenCalledTimes(1);
  });
});
