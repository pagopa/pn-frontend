import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen } from '../../../__test__/test-utils';
import PecVerificationDialog from '../PecVerificationDialog';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const closeHandler = vi.fn();

describe('PecVerificationDialog Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - confirmation modal visible', () => {
    // render component
    render(<PecVerificationDialog pecValidationOpen setPecValidationOpen={closeHandler} />);
    const dialog = screen.getByTestId('validationDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('legal-contacts.validation-progress-title');
    const bodyEl = getById(dialog, 'dialog-description');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('legal-contacts.validation-progress-content');
    const confirmButton = screen.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
  });

  it('click on confirm button', () => {
    // render component
    render(<PecVerificationDialog pecValidationOpen setPecValidationOpen={closeHandler} />);
    const confirmButton = screen.getByText('button.conferma');
    fireEvent.click(confirmButton);
    expect(closeHandler).toHaveBeenCalled();
  });
});
