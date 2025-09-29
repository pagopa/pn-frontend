import MockAdapter from 'axios-mock-adapter';

import { ResponseEventDispatcher } from '@pagopa-pn/pn-commons';
import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';
import userEvent from '@testing-library/user-event';

import { mandatesByDelegate, mandatesByDelegator } from '../../__mocks__/Delegations.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
import { RenderResult, act, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { DelegationStatus } from '../../utility/status.utility';
import Deleghe from '../Deleghe.page';

describe('Deleghe page', async () => {
  const original = window.matchMedia;
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    window.matchMedia = original;
    mock.restore();
  });

  it('renders the desktop view of the deleghe page - no data', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, []);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, []);
    await act(async () => {
      result = render(<Deleghe />);
    });
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    const delegates = result.getByTestId('delegates-wrapper');
    expect(delegates).toBeInTheDocument();
    const delegators = result.getByTestId('delegators-wrapper');
    expect(delegators).toBeInTheDocument();
    const mobileDelegates = result.queryByTestId('mobile-delegates-wrapper');
    expect(mobileDelegates).not.toBeInTheDocument();
    const mobileDelegators = result.queryByTestId('mobile-delegators-wrapper');
    expect(mobileDelegators).not.toBeInTheDocument();
    expect(mock.history.get).toHaveLength(2);
  });

  it('renders the mobile view of the deleghe page - no data', async () => {
    window.matchMedia = createMatchMedia(800);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, []);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, []);
    await act(async () => {
      result = render(<Deleghe />);
    });
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    const delegates = result.queryByTestId('delegates-wrapper');
    expect(delegates).not.toBeInTheDocument();
    const delegators = result.queryByTestId('delegators-wrapper');
    expect(delegators).not.toBeInTheDocument();
    const mobileDelegates = result.getByTestId('mobile-delegates-wrapper');
    expect(mobileDelegates).toBeInTheDocument();
    const mobileDelegators = result.getByTestId('mobile-delegators-wrapper');
    expect(mobileDelegators).toBeInTheDocument();
    expect(mock.history.get).toHaveLength(2);
  });

  it('revoke a delegate', async () => {
    window.matchMedia = createMatchMedia(2000);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    mock.onPatch(`/bff/v1/mandate/${mandatesByDelegator[0].mandateId}/revoke`).reply(204);
    await act(async () => {
      result = render(<Deleghe />);
    });
    // get first delegate row
    let delegatesRows = result.getAllByTestId('delegatesTable.body.row');
    const delegationMenuIcon = within(delegatesRows[0]).getByTestId('delegationMenuIcon');
    // open menu
    await userEvent.click(delegationMenuIcon);
    const revokeDelegate = await waitFor(() => result.getByTestId('menuItem-revokeDelegate'));
    // show confirmation dialog
    await userEvent.click(revokeDelegate);
    const dialog = await waitFor(() => result.getByTestId('confirmationDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.revocation_question');
    const confirmButton = within(dialog).getByRole('button', {
      name: 'deleghe.confirm_revocation',
    });
    // confirm revokation
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe(
        `/bff/v1/mandate/${mandatesByDelegator[0].mandateId}/revoke`
      );
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // check that the list of delegates is updated
    delegatesRows = result.getAllByTestId('delegatesTable.body.row');
    expect(delegatesRows).toHaveLength(mandatesByDelegator.length - 1);
    delegatesRows.forEach((row, index) => {
      // index + 1 because i suppose that the first delegate is revoked
      expect(row).toHaveTextContent(mandatesByDelegator[index + 1].delegate?.displayName!);
    });
  });

  it('reject a delegator', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    mock.onPatch(`/bff/v1/mandate/${mandatesByDelegate[1].mandateId}/reject`).reply(204);
    await act(async () => {
      result = render(<Deleghe />);
    });
    // get second delegator row
    let delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    const delegationMenuIcon = within(delegatorsRows[1]).getByTestId('delegationMenuIcon');
    // open menu
    await userEvent.click(delegationMenuIcon);
    const rejectDelegator = await waitFor(() => result.getByTestId('menuItem-rejectDelegator'));
    // show confirmation dialog
    await userEvent.click(rejectDelegator);
    const dialog = await waitFor(() => result.getByTestId('confirmationDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.rejection_question');
    const confirmButton = within(dialog).getByRole('button', {
      name: 'deleghe.confirm_rejection',
    });
    // confirm rejection
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe(
        `/bff/v1/mandate/${mandatesByDelegate[1].mandateId}/reject`
      );
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // check that the list of delegators is updated
    delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    expect(delegatorsRows).toHaveLength(mandatesByDelegate.length - 1);
    const newDelegators = mandatesByDelegate.filter(
      (del) => del.mandateId !== mandatesByDelegate[1].mandateId
    );
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(newDelegators[index].delegator?.displayName!);
    });
  });

  it('accept a delegation', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    mock
      .onPatch(`/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/accept`, {
        verificationCode: mandatesByDelegate[0].verificationCode,
      })
      .reply(204);
    await act(async () => {
      result = render(<Deleghe />);
    });
    // get first delegator row
    let delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    const acceptButton = within(delegatorsRows[0]).getByTestId('acceptButton');
    // show code dialog
    await userEvent.click(acceptButton);
    const dialog = await waitFor(() => result.getByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.accept_title');
    expect(dialog).toHaveTextContent('deleghe.accept_description');
    expect(dialog).toHaveTextContent('deleghe.verification_code');

    // fill the code
    const textbox = within(dialog).getByRole('textbox');
    textbox.focus();
    await userEvent.keyboard(mandatesByDelegate[0].verificationCode);

    const dialogButtons = within(dialog).getByRole('button', { name: 'deleghe.accept' });
    // confirm rejection
    await userEvent.click(dialogButtons);
    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe(
        `/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/accept`
      );
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        verificationCode: mandatesByDelegate[0].verificationCode,
      });
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // check that the list of delegators is updated
    delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    expect(delegatorsRows).toHaveLength(mandatesByDelegate.length);
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(mandatesByDelegate[index].delegator?.displayName!);
    });
    const newAcceptButton = within(delegatorsRows[0]).queryByTestId('acceptButton');
    expect(newAcceptButton).not.toBeInTheDocument();
    expect(delegatorsRows[0]).toHaveTextContent(`deleghe.table.${DelegationStatus.ACTIVE}`);
  });

  it('accept a delegation - error', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    mock
      .onPatch(`/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/accept`, {
        verificationCode: mandatesByDelegate[0].verificationCode,
      })
      .reply(errorMock.status, errorMock.data);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <Deleghe />
        </>
      );
    });
    // get first delegator row
    let delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    let acceptButton = within(delegatorsRows[0]).getByTestId('acceptButton');
    // show code dialog
    await userEvent.click(acceptButton);
    const dialog = await waitFor(() => result.getByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.accept_title');
    expect(dialog).toHaveTextContent('deleghe.accept_description');
    expect(dialog).toHaveTextContent('deleghe.verification_code');

    // fill the code
    const textbox = within(dialog).getByRole('textbox');
    textbox.focus();
    await userEvent.keyboard(mandatesByDelegate[0].verificationCode);

    const dialogButtons = within(dialog).getByRole('button', { name: 'deleghe.accept' });
    // confirm accept
    await userEvent.click(dialogButtons);
    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe(
        `/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/accept`
      );
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        verificationCode: mandatesByDelegate[0].verificationCode,
      });
    });
    const error = await waitFor(() => within(dialog).getByTestId('errorAlert'));
    expect(error).toBeInTheDocument();
    // check that accept button is still active in deleghe page
    delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    expect(delegatorsRows).toHaveLength(mandatesByDelegate.length);
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(mandatesByDelegate[index].delegator?.displayName!);
    });
    acceptButton = within(delegatorsRows[0]).getByTestId('acceptButton');
    expect(acceptButton).toBeInTheDocument();
  });
});
