import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { render, screen } from '../../../__test__/test-utils';
import PecValueDialog from '../PecValueDialog';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const closeHandler = vi.fn();
const confirmHandler = vi.fn();

describe('PecVerificationDialog Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component', () => {
    // render component
    render(<PecValueDialog open onConfirm={confirmHandler} onDiscard={closeHandler} />);
    const dialog = screen.getByTestId('pecValueDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('legal-contacts.validation-progress-title');
    const bodyEl = getById(dialog, 'dialog-description');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('legal-contacts.validation-progress-content');
    const confirmButton = screen.getByText('button.conferma');
    expect(confirmButton).toBeInTheDocument();
  });
});
