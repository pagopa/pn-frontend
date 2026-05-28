import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { ResponseEventDispatcher } from '@pagopa-pn/pn-commons';
import userEvent from '@testing-library/user-event';

import { mandatesByDelegate, mandatesByDelegator } from '../../../__mocks__/Delegations.mock';
import { act, render, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import Deleghe from '../../Deleghe.page';

describe('Deleghe.page - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_YOUR_MANDATES when the page data is loaded', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);

    await act(async () => {
      render(<Deleghe />);
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_YOUR_MANDATES,
        expect.objectContaining({
          delegates: expect.any(Array),
          delegators: expect.any(Array),
        })
      );
    });
  });

  it('fires SEND_MANDATE_REVOKED and SEND_MANDATE_GIVEN when a delegation is revoked', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    mock.onPatch(`/bff/v1/mandate/${mandatesByDelegator[0].mandateId}/revoke`).reply(204);

    await act(async () => {
      render(<Deleghe />);
    });

    const delegatesRows = await waitFor(() =>
      document.querySelectorAll('[data-testid="delegatesTable.body.row"]')
    );
    const menuIcon = within(delegatesRows[0] as HTMLElement).getByTestId('delegationMenuIcon');
    await userEvent.click(menuIcon);
    await userEvent.click(await waitFor(() => document.querySelector('[data-testid="menuItem-revokeDelegate"]') as HTMLElement));
    const dialog = await waitFor(() => document.querySelector('[data-testid="confirmationDialog"]') as HTMLElement);
    const confirmButton = within(dialog).getByRole('button', { name: 'deleghe.confirm_revocation' });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_MANDATE_REVOKED);
    });
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_MANDATE_GIVEN,
        expect.objectContaining({ delegators: expect.any(Array) })
      );
    });
  });

  it('fires SEND_MANDATE_REJECTED and SEND_HAS_MANDATE when a delegator is rejected', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    mock.onPatch(`/bff/v1/mandate/${mandatesByDelegate[1].mandateId}/reject`).reply(204);

    await act(async () => {
      render(<Deleghe />);
    });

    const delegatorsRows = await waitFor(() =>
      document.querySelectorAll('[data-testid="delegatorsTable.body.row"]')
    );
    const menuIcon = within(delegatorsRows[1] as HTMLElement).getByTestId('delegationMenuIcon');
    await userEvent.click(menuIcon);
    await userEvent.click(await waitFor(() => document.querySelector('[data-testid="menuItem-rejectDelegator"]') as HTMLElement));
    const dialog = await waitFor(() => document.querySelector('[data-testid="confirmationDialog"]') as HTMLElement);
    const confirmButton = within(dialog).getByRole('button', { name: 'deleghe.confirm_rejection' });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_MANDATE_REJECTED);
    });
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_HAS_MANDATE,
        expect.objectContaining({ delegates: expect.any(Array) })
      );
    });
  });

  it('fires SEND_MANDATE_ACCEPTED when a delegation is accepted', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    mock
      .onPatch(`/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/accept`, {
        verificationCode: mandatesByDelegate[0].verificationCode,
      })
      .reply(204);

    await act(async () => {
      render(<Deleghe />);
    });

    const delegatorsRows = await waitFor(() =>
      document.querySelectorAll('[data-testid="delegatorsTable.body.row"]')
    );
    await userEvent.click(within(delegatorsRows[0] as HTMLElement).getByTestId('acceptButton'));
    const dialog = await waitFor(() => document.querySelector('[data-testid="codeDialog"]') as HTMLElement);
    const textbox = within(dialog).getByRole('textbox');
    textbox.focus();
    await userEvent.keyboard(mandatesByDelegate[0].verificationCode);
    await userEvent.click(within(dialog).getByRole('button', { name: 'deleghe.accept' }));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_MANDATE_ACCEPTED);
    });
  });

  it('fires SEND_MANDATE_ACCEPT_CODE_ERROR when accept API returns an error', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    mock
      .onPatch(`/bff/v1/mandate/${mandatesByDelegate[0].mandateId}/accept`, {
        verificationCode: mandatesByDelegate[0].verificationCode,
      })
      .reply(500, { status: 500, title: 'error', detail: 'error' });

    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <Deleghe />
        </>
      );
    });

    const delegatorsRows = await waitFor(() =>
      document.querySelectorAll('[data-testid="delegatorsTable.body.row"]')
    );
    await userEvent.click(within(delegatorsRows[0] as HTMLElement).getByTestId('acceptButton'));
    const dialog = await waitFor(() => document.querySelector('[data-testid="codeDialog"]') as HTMLElement);
    const textbox = within(dialog).getByRole('textbox');
    textbox.focus();
    await userEvent.keyboard(mandatesByDelegate[0].verificationCode);
    await userEvent.click(within(dialog).getByRole('button', { name: 'deleghe.accept' }));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_MANDATE_ACCEPT_CODE_ERROR);
    });
  });
});
