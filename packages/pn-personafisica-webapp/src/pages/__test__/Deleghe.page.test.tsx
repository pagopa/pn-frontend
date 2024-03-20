import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { arrayOfDelegates, arrayOfDelegators } from '../../__mocks__/Delegations.mock';
import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
} from '../../api/delegations/delegations.routes';
import { DelegationStatus } from '../../utility/status.utility';
import Deleghe from '../Deleghe.page';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

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
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
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
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
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
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    mock.onPatch(REVOKE_DELEGATION(arrayOfDelegates[0].mandateId)).reply(204);
    await act(async () => {
      result = render(<Deleghe />);
    });
    // get first delegate row
    let delegatesRows = result.getAllByTestId('delegatesTable.body.row');
    const delegationMenuIcon = within(delegatesRows[0]).getByTestId('delegationMenuIcon');
    // open menu
    fireEvent.click(delegationMenuIcon);
    const revokeDelegate = await waitFor(() => result.getByTestId('menuItem-revokeDelegate'));
    // show confirmation dialog
    fireEvent.click(revokeDelegate);
    const dialog = await waitFor(() => result.getByTestId('dialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.revocation_question');
    const confirmButton = within(dialog).getByRole('button', {
      name: 'deleghe.confirm_revocation',
    });
    // confirm revokation
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe(REVOKE_DELEGATION(arrayOfDelegates[0].mandateId));
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // check that the list of delegates is updated
    delegatesRows = result.getAllByTestId('delegatesTable.body.row');
    expect(delegatesRows).toHaveLength(arrayOfDelegates.length - 1);
    delegatesRows.forEach((row, index) => {
      // index + 1 because i suppose that the first delegate is revoked
      expect(row).toHaveTextContent(arrayOfDelegates[index + 1].delegate?.displayName!);
    });
  });

  it('reject a delegator', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    mock.onPatch(REJECT_DELEGATION(arrayOfDelegators[1].mandateId)).reply(204);
    await act(async () => {
      result = render(<Deleghe />);
    });
    // get second delegator row
    let delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    const delegationMenuIcon = within(delegatorsRows[1]).getByTestId('delegationMenuIcon');
    // open menu
    fireEvent.click(delegationMenuIcon);
    const rejectDelegator = await waitFor(() => result.getByTestId('menuItem-rejectDelegator'));
    // show confirmation dialog
    fireEvent.click(rejectDelegator);
    const dialog = await waitFor(() => result.getByTestId('dialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.rejection_question');
    const confirmButton = within(dialog).getByRole('button', {
      name: 'deleghe.confirm_rejection',
    });
    // confirm rejection
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe(REJECT_DELEGATION(arrayOfDelegators[1].mandateId));
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // check that the list of delegators is updated
    delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    expect(delegatorsRows).toHaveLength(arrayOfDelegators.length - 1);
    const newDelegators = arrayOfDelegators.filter(
      (del) => del.mandateId !== arrayOfDelegators[1].mandateId
    );
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(newDelegators[index].delegator?.displayName!);
    });
  });

  it('accept a delegation', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    mock
      .onPatch(ACCEPT_DELEGATION(arrayOfDelegators[0].mandateId), {
        verificationCode: arrayOfDelegators[0].verificationCode,
      })
      .reply(204);
    await act(async () => {
      result = render(<Deleghe />);
    });
    // get first delegator row
    let delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    const acceptButton = within(delegatorsRows[0]).getByTestId('acceptButton');
    // show code dialog
    fireEvent.click(acceptButton);
    const dialog = await waitFor(() => result.getByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.accept_title');
    expect(dialog).toHaveTextContent('deleghe.accept_description');
    expect(dialog).toHaveTextContent('deleghe.verification_code');
    // fill the inputs
    const codeInputs = dialog?.querySelectorAll('input');
    expect(codeInputs).toHaveLength(5);
    const codes = arrayOfDelegators[0].verificationCode.split('');
    codeInputs?.forEach((codeInput, index) => {
      fireEvent.change(codeInput, { target: { value: codes[index] } });
    });
    const dialogButtons = within(dialog).getByRole('button', { name: 'deleghe.accept' });
    // confirm rejection
    fireEvent.click(dialogButtons);
    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe(ACCEPT_DELEGATION(arrayOfDelegators[0].mandateId));
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        verificationCode: arrayOfDelegators[0].verificationCode,
      });
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // check that the list of delegators is updated
    delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    expect(delegatorsRows).toHaveLength(arrayOfDelegators.length);
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(arrayOfDelegators[index].delegator?.displayName!);
    });
    const newAcceptButton = within(delegatorsRows[0]).queryByTestId('acceptButton');
    expect(newAcceptButton).not.toBeInTheDocument();
    expect(delegatorsRows[0]).toHaveTextContent(`deleghe.table.${DelegationStatus.ACTIVE}`);
  });

  it('accept a delegation - error', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    mock
      .onPatch(ACCEPT_DELEGATION(arrayOfDelegators[0].mandateId), {
        verificationCode: arrayOfDelegators[0].verificationCode,
      })
      .reply(500);
    await act(async () => {
      result = render(<Deleghe />);
    });
    // get first delegator row
    let delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    let acceptButton = within(delegatorsRows[0]).getByTestId('acceptButton');
    // show code dialog
    fireEvent.click(acceptButton);
    const dialog = await waitFor(() => result.getByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.accept_title');
    expect(dialog).toHaveTextContent('deleghe.accept_description');
    expect(dialog).toHaveTextContent('deleghe.verification_code');
    // fill the inputs
    const codeInputs = dialog?.querySelectorAll('input');
    expect(codeInputs).toHaveLength(5);
    const codes = arrayOfDelegators[0].verificationCode.split('');
    codeInputs?.forEach((codeInput, index) => {
      fireEvent.change(codeInput, { target: { value: codes[index] } });
    });
    const dialogButtons = within(dialog).getByRole('button', { name: 'deleghe.accept' });
    // confirm rejection
    fireEvent.click(dialogButtons);
    await waitFor(() => {
      expect(mock.history.patch).toHaveLength(1);
      expect(mock.history.patch[0].url).toBe(ACCEPT_DELEGATION(arrayOfDelegators[0].mandateId));
      expect(JSON.parse(mock.history.patch[0].data)).toStrictEqual({
        verificationCode: arrayOfDelegators[0].verificationCode,
      });
    });
    // check that nothing is changed
    delegatorsRows = result.getAllByTestId('delegatorsTable.body.row');
    expect(delegatorsRows).toHaveLength(arrayOfDelegators.length);
    delegatorsRows.forEach((row, index) => {
      expect(row).toHaveTextContent(arrayOfDelegators[index].delegator?.displayName!);
    });
    acceptButton = within(delegatorsRows[0]).getByTestId('acceptButton');
    expect(acceptButton).toBeInTheDocument();
    const error = await waitFor(() => within(dialog).queryByTestId('errorAlert'));
    expect(error).toBeInTheDocument();
  });
});
