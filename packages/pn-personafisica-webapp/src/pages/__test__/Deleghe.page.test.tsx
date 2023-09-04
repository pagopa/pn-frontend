import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
} from '../../api/delegations/delegations.routes';
import { Delegation } from '../../redux/delegation/types';
import Deleghe from '../Deleghe.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../component/Deleghe/Delegates', () => ({
  __esModule: true,
  default: () => <div>delegates</div>,
}));

jest.mock('../../component/Deleghe/MobileDelegates', () => ({
  __esModule: true,
  default: () => <div>mobile delegates</div>,
}));

jest.mock('../../component/Deleghe/Delegators', () => ({
  __esModule: true,
  default: () => <div>delegators</div>,
}));

jest.mock('../../component/Deleghe/MobileDelegators', () => ({
  __esModule: true,
  default: () => <div>mobile delegators</div>,
}));

const initialState = {
  delegations: {
    delegators: [] as Array<Delegation>,
    delegates: [] as Array<Delegation>,
    isCompany: false,
  },
  modalState: {
    open: false,
    id: '',
    type: '',
  },
  acceptModalState: {
    open: false,
    id: '',
    name: '',
    error: false,
  },
  sortDelegators: {
    orderBy: '',
    order: 'asc' as 'asc' | 'desc',
  },
  sortDelegates: {
    orderBy: '',
    order: 'asc' as 'asc' | 'desc',
  },
};

describe('Deleghe page', () => {
  const original = window.matchMedia;
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    window.matchMedia = createMatchMedia(800);
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    window.matchMedia = original;
    mock.restore();
  });

  const renderComponent = async (
    openConfirmationModal: boolean,
    openCodeModal: boolean,
    type: 'delegates' | 'delegators'
  ) => {
    await act(async () => {
      result = render(<Deleghe />, {
        preloadedState: {
          delegationsState: {
            ...initialState,
            modalState: {
              id: '1',
              open: openConfirmationModal,
              type,
            },
            acceptModalState: {
              id: '1',
              open: openCodeModal,
              name: 'Nome',
              error: false,
            },
          },
        },
      });
    });
  };

  it('renders the desktop view of the deleghe page', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
    await renderComponent(false, false, 'delegates');
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).toHaveTextContent(/delegates/i);
    expect(result.container).toHaveTextContent(/delegators/i);
    expect(mock.history.get).toHaveLength(2);
  });

  it('renders the mobile view of the deleghe page', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
    await renderComponent(false, false, 'delegates');
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).toHaveTextContent(/mobile delegates/i);
    expect(result.container).toHaveTextContent(/mobile delegators/i);
    expect(mock.history.get).toHaveLength(2);
  });

  it('checks the revocation modal open', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
    mock.onPatch(REVOKE_DELEGATION('1')).reply(204);
    await renderComponent(true, false, 'delegates');
    const confirmRevocationButton = result.getByText(/deleghe.confirm_revocation/i);
    const closeButton = result.getByText(/button.annulla/i);
    expect(mock.history.get).toHaveLength(2);
    expect(result.baseElement).toHaveTextContent(/deleghe.revocation_question/i);
    expect(result.baseElement).toHaveTextContent(/deleghe.confirm_revocation/i);
    fireEvent.click(confirmRevocationButton);
    expect(mock.history.patch).toHaveLength(1);
    fireEvent.click(closeButton);
    await waitFor(() =>
      expect(result.baseElement).not.toHaveTextContent(/deleghe.revocation_question/i)
    );
  });

  it('checks the rejection modal open', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
    mock.onPatch(REJECT_DELEGATION('1')).reply(204);
    await renderComponent(true, false, 'delegators');
    const confirmRejectionButton = result.getByText(/deleghe.confirm_rejection/i);
    const closeButton = result.getByText(/button.annulla/i);
    expect(mock.history.get).toHaveLength(2);
    expect(result.baseElement).toHaveTextContent(/deleghe.rejection_question/i);
    expect(result.baseElement).toHaveTextContent(/deleghe.confirm_rejection/i);
    fireEvent.click(confirmRejectionButton);
    expect(mock.history.patch).toHaveLength(1);
    fireEvent.click(closeButton);
    await waitFor(() =>
      expect(result.baseElement).not.toHaveTextContent(/deleghe.rejection_question/i)
    );
  });

  it('checks the accept modal open', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
    mock.onPatch(ACCEPT_DELEGATION('1'), { verificationCode: '11111' }).reply(204);
    await renderComponent(false, true, 'delegators');
    const codeInput = result.queryAllByPlaceholderText('-');
    const confirmAcceptButton = result.getByText('deleghe.accept');
    const closeButton = result.getByText(/button.indietro/i);
    expect(mock.history.get).toHaveLength(2);
    expect(result.baseElement).toHaveTextContent(/deleghe.accept_title/i);
    expect(codeInput).toHaveLength(5);
    codeInput.forEach((input) => {
      fireEvent.change(input, { target: { value: '1' } });
    });
    fireEvent.click(confirmAcceptButton);
    expect(mock.history.patch).toHaveLength(1);
    fireEvent.click(closeButton);
    await waitFor(() => expect(result.baseElement).not.toHaveTextContent(/deleghe.accept_title/i));
  });

  it('checks the accept modal error state', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
    mock.onPatch(ACCEPT_DELEGATION('1'), { verificationCode: '11111' }).reply(500);
    await renderComponent(false, true, 'delegators');
    const dialog = result.queryByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    const codeInput = within(dialog!).queryAllByPlaceholderText('-');
    const confirmAcceptButton = within(dialog!).getByText('deleghe.accept');
    expect(codeInput).toHaveLength(5);
    codeInput.forEach((input) => {
      fireEvent.change(input, { target: { value: '1' } });
    });
    fireEvent.click(confirmAcceptButton);
    await waitFor(() => expect(mock.history.patch).toHaveLength(1));
    const error = await waitFor(() => within(dialog!).queryByTestId('errorAlert'));
    expect(error).toBeInTheDocument();
  });
});
