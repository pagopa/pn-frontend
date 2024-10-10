import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import SercqSendIODialog from '../SercqSendIODialog';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, options?: { returnObjects: boolean }) =>
      options?.returnObjects ? [str] : str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const discardHandler = vi.fn();

describe('test SercqSendInfoDialog', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component', () => {
    // render component
    render(<SercqSendIODialog open onDiscard={discardHandler} />);
    const dialog = screen.getByTestId('sercqSendIODialog');
    const titleEl = getById(dialog, 'dialog-title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('legal-contacts.sercq-send-io-title');
    const bodyEl = within(dialog).getByTestId('dialog-content');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-io-description');
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-io-advantages');
    expect(bodyEl).toHaveTextContent('legal-contacts.sercq-send-io-list');
    const cancelButton = screen.getByText('button.not-now');
    expect(cancelButton).toBeInTheDocument();
    const confirmButton = screen.getByText('button.attiva');
    expect(confirmButton).toBeInTheDocument();
  });

  it('clicks on buttons', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);
    // render component
    render(<SercqSendIODialog open onDiscard={discardHandler} />);
    const cancelButton = screen.getByText('button.not-now');
    fireEvent.click(cancelButton);
    expect(discardHandler).toHaveBeenCalledTimes(1);
    const confirmButton = screen.getByText('button.attiva');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
    expect(discardHandler).toHaveBeenCalledTimes(2);
  });
});
