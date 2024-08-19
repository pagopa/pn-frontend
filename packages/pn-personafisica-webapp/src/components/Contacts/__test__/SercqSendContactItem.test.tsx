import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { SERCQ_SEND_VALUE } from '../../../models/contacts';
import SercqSendContactItem from '../SercqSendContactItem';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, options?: { returnObjects: boolean }) =>
      options?.returnObjects ? [str] : str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('test SercqSendContactItem', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component - disabled', () => {
    // render component
    const { container, getByTestId } = render(<SercqSendContactItem value="" />);
    expect(container).toHaveTextContent('legal-contacts.sercq-send-title');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-description');
    const newsBadge = getByTestId('newsBadge');
    expect(newsBadge).toBeInTheDocument();
    const activateButton = getByTestId('activateButton');
    expect(activateButton).toBeInTheDocument();
    expect(activateButton).toHaveTextContent('legal-contacts.sercq-send-active');
    expect(activateButton).toBeEnabled();
  });

  it('enable service - courtesy contacts added', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    // render component
    const { container, getByTestId, rerender, queryByTestId, getByText } = render(
      <SercqSendContactItem value="" />,
      {
        preloadedState: { contactsState: { digitalAddresses: digitalCourtesyAddresses } },
      }
    );
    const activateButton = getByTestId('activateButton');
    fireEvent.click(activateButton);
    let infoDialog = await waitFor(() => screen.getByTestId('sercqSendInfoDialog'));
    expect(infoDialog).toBeInTheDocument();
    // close info dialog
    const cancelButton = within(infoDialog).getByText('button.annulla');
    fireEvent.click(cancelButton);
    await waitFor(() => expect(infoDialog).not.toBeInTheDocument());
    // reopen info dialog
    fireEvent.click(activateButton);
    infoDialog = await waitFor(() => screen.getByTestId('sercqSendInfoDialog'));
    // click on confirm and enable the service
    const enableButton = within(infoDialog).getByText('button.enable');
    fireEvent.click(enableButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: SERCQ_SEND_VALUE,
      });
    });
    await waitFor(() => expect(infoDialog).not.toBeInTheDocument());
    // simulate rerendering due to redux changes
    rerender(<SercqSendContactItem value={SERCQ_SEND_VALUE} />);
    // check new layout
    expect(container).toHaveTextContent('legal-contacts.sercq-send-title');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-description');
    const newsBadge = queryByTestId('newsBadge');
    expect(newsBadge).not.toBeInTheDocument();
    const newActivateButton = queryByTestId('activateButton');
    expect(newActivateButton).not.toBeInTheDocument();
    expect(container).toHaveTextContent('legal-contacts.sercq-send-enabled');
    const disableButton = getByText('button.disable');
    expect(disableButton).toBeInTheDocument();
  });

  it('enable service - courtesy contacts not added - click on not now button', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    // render component
    const { container, getByTestId, rerender, getByText } = render(
      <SercqSendContactItem value="" />
    );
    const activateButton = getByTestId('activateButton');
    fireEvent.click(activateButton);
    const infoDialog = await waitFor(() => screen.getByTestId('sercqSendInfoDialog'));
    expect(infoDialog).toBeInTheDocument();
    // click on confirm and enable the service
    const enableButton = within(infoDialog).getByText('button.enable');
    fireEvent.click(enableButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: SERCQ_SEND_VALUE,
      });
    });
    await waitFor(() => expect(infoDialog).not.toBeInTheDocument());
    // simulate rerendering due to redux changes
    rerender(<SercqSendContactItem value={SERCQ_SEND_VALUE} />);
    const courtesyDialog = await waitFor(() => screen.getByTestId('sercqSendCourtesyDialog'));
    expect(courtesyDialog).toBeInTheDocument();
    // click on not now button
    const notNowButton = within(courtesyDialog).getByText('button.not-now');
    fireEvent.click(notNowButton);
    await waitFor(() => expect(courtesyDialog).not.toBeInTheDocument());
    // check new layout
    expect(container).toHaveTextContent('legal-contacts.sercq-send-enabled');
    const disableButton = getByText('button.disable');
    expect(disableButton).toBeInTheDocument();
  });

  it('enable service - courtesy contacts not added - add courtesy contact', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/SERCQ', {
        value: SERCQ_SEND_VALUE,
      })
      .reply(204);
    // render component
    const { getByTestId, rerender } = render(<SercqSendContactItem value="" />);
    const activateButton = getByTestId('activateButton');
    fireEvent.click(activateButton);
    const infoDialog = await waitFor(() => screen.getByTestId('sercqSendInfoDialog'));
    expect(infoDialog).toBeInTheDocument();
    // click on confirm and enable the service
    const enableButton = within(infoDialog).getByText('button.enable');
    fireEvent.click(enableButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: SERCQ_SEND_VALUE,
      });
    });
    await waitFor(() => expect(infoDialog).not.toBeInTheDocument());
    // simulate rerendering due to redux changes
    rerender(<SercqSendContactItem value={SERCQ_SEND_VALUE} />);
    const courtesyDialog = await waitFor(() => screen.getByTestId('sercqSendCourtesyDialog'));
    expect(courtesyDialog).toBeInTheDocument();
    // click on confirm button
    const confirmButton = within(courtesyDialog).getByText('button.conferma');
    fireEvent.click(confirmButton);
    /*
    await waitFor(() => expect(courtesyDialog).not.toBeInTheDocument());
    // check new layout
    expect(container).toHaveTextContent('legal-contacts.sercq-send-enabled');
    const disableButton = getByText('button.disable');
    expect(disableButton).toBeInTheDocument();
    */
  });
});
