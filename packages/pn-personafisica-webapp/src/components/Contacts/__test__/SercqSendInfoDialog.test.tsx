import { ReactNode } from 'react';
import { vi } from 'vitest';

import { PRIVACY_LINK_RELATIVE_PATH, TOS_LINK_RELATIVE_PATH } from '@pagopa-pn/pn-commons';
import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen, within } from '../../../__test__/test-utils';
import SercqSendInfoDialog from '../SercqSendInfoDialog';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, options?: { returnObjects: boolean }) =>
      options?.returnObjects ? [str] : str,
  }),
  Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components?.map((c) => c)}
    </>
  ),
}));

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
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-info-tos-privacy');
    const cancelButton = screen.getByText('button.annulla');
    expect(cancelButton).toBeInTheDocument();
    const enableButton = screen.getByText('button.enable');
    expect(enableButton).toBeInTheDocument();
  });

  it('navigate to privacy and tos pages', () => {
    // render component
    render(<SercqSendInfoDialog open onConfirm={confirmHandler} onDiscard={discardHandler} />);
    const tosLink = screen.getByTestId('tos-link');
    fireEvent.click(tosLink);
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(TOS_LINK_RELATIVE_PATH, '_blank');
    const privacyLink = screen.getByTestId('privacy-link');
    fireEvent.click(privacyLink);
    expect(mockOpenFn).toHaveBeenCalledTimes(2);
    expect(mockOpenFn).toHaveBeenCalledWith(PRIVACY_LINK_RELATIVE_PATH, '_blank');
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
