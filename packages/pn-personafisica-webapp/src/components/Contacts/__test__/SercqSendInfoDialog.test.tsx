import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen, within } from '../../../__test__/test-utils';
import { TERMS_OF_SERVICE_SERCQ_SEND } from '../../../navigation/routes.const';
import SercqSendInfoDialog from '../SercqSendInfoDialog';

const discardHandler = vi.fn();
const confirmHandler = vi.fn();
const mockOpenFn = vi.fn();

describe('test SercqSendInfoDialog', () => {
  const original = window.open;

  beforeAll(() => {
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('render component', () => {
    // render component
    render(<SercqSendInfoDialog open onConfirm={confirmHandler} onDiscard={discardHandler} />);
    const dialog = screen.getByTestId('sercqSendInfoDialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('legal-contacts.sercq-send-info-title');
    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-info-description');
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-info-advantages');
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-info-pec-disclaimer');
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-info-tos');
    const cancelButton = screen.getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    const enableButton = screen.getByText('button.enable');
    expect(enableButton).toBeInTheDocument();
  });

  it('navigate to tos page', () => {
    // render component
    render(<SercqSendInfoDialog open onConfirm={confirmHandler} onDiscard={discardHandler} />);
    const tosLink = screen.getByTestId('tos-link');
    fireEvent.click(tosLink);
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(TERMS_OF_SERVICE_SERCQ_SEND, '_blank');
  });

  it('click on buttons', () => {
    // render component
    render(<SercqSendInfoDialog open onConfirm={confirmHandler} onDiscard={discardHandler} />);
    const cancelButton = screen.getByText('button.annulla');
    fireEvent.click(cancelButton);
    expect(discardHandler).toHaveBeenCalledTimes(1);
    const enableButton = screen.getByText('button.enable');
    fireEvent.click(enableButton);
    expect(confirmHandler).toHaveBeenCalledTimes(1);
  });
});
