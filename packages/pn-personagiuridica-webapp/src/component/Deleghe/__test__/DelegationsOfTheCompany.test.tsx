import React from 'react';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';
import {
  testAutocomplete,
  render,
  screen,
  waitFor,
  fireEvent,
  within,
  mockApi,
  act,
} from '../../../__test__/test-utils';
import { arrayOfDelegators } from '../../../redux/delegation/__test__/test.utils';
import { DELEGATION_ACTIONS } from '../../../redux/delegation/actions';
import { apiClient } from '../../../api/apiClients';
import { DELEGATIONS_BY_DELEGATE } from '../../../api/delegations/delegations.routes';
import { DelegationStatus } from '../../../models/Deleghe';
import DelegationsOfTheCompany from '../DelegationsOfTheCompany';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

/**
 * Vedi commenti nella definizione di simpleMockForApiErrorWrapper
 */
jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    ApiErrorWrapper: original.simpleMockForApiErrorWrapper,
  };
});

const initialState = {
  delegationsState: {
    delegations: {
      delegators: [],
    },
    pagination: {
      nextPagesKey: [],
      moreResult: false,
    },
    groups: [],
    delegatorsNames: [],
  },
};

export async function testMultiSelect(
  form: HTMLElement,
  elementName: string,
  options: Array<{ id: string; name: string }>,
  optToSelect: number,
  mustBeOpened: boolean
) {
  if (mustBeOpened) {
    const selectButton = form.querySelector(`div[id="${elementName}"]`);
    fireEvent.mouseDown(selectButton!);
  }
  const selectOptionsContainer = await screen.findByRole('presentation');
  expect(selectOptionsContainer).toBeInTheDocument();
  const selectOptionsList = await within(selectOptionsContainer).findByRole('listbox');
  expect(selectOptionsList).toBeInTheDocument();
  const selectOptionsListItems = await within(selectOptionsList).findAllByRole('option');
  expect(selectOptionsListItems).toHaveLength(options.length);
  selectOptionsListItems.forEach((opt, index) => {
    expect(opt).toHaveTextContent(options[index].name);
  });
  fireEvent.click(selectOptionsListItems[optToSelect]);
}

describe('DelegationsOfTheCompany Component - assuming API works properly', () => {
  it('renders the empty state', () => {
    const result = render(<DelegationsOfTheCompany />, {
      preloadedState: initialState,
    });

    expect(result.container).toHaveTextContent(/deleghe.delegatorsTitle/i);
    expect(result.container).toHaveTextContent(/deleghe.no_delegators/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.name/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationStart/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationEnd/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.permissions/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.groups/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.status/i);
  });

  it('renders the table', () => {
    const result = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState.delegationsState,
          delegations: {
            delegators: arrayOfDelegators,
          },
        },
      },
    });

    expect(result.container).not.toHaveTextContent(/deleghe.no_delegators/i);
    expect(result.container).toHaveTextContent(/deleghe.table.name/i);
    expect(result.container).toHaveTextContent(/deleghe.table.delegationStart/i);
    expect(result.container).toHaveTextContent(/deleghe.table.delegationEnd/i);
    expect(result.container).toHaveTextContent(/deleghe.table.permissions/i);
    expect(result.container).toHaveTextContent(/deleghe.table.groups/i);
    expect(result.container).toHaveTextContent(/deleghe.table.status/i);
    expect(result.container).toHaveTextContent(/marco verdi/i);
    expect(result.container).toHaveTextContent(/davide legato/i);
  });

  it('filters the results', async () => {
    const mock = mockApi(
      apiClient,
      'POST',
      DELEGATIONS_BY_DELEGATE({ size: 10, nextPageKey: undefined }),
      200,
      {
        groups: ['group-2'],
        status: [DelegationStatus.ACTIVE, DelegationStatus.REJECTED],
        delegatorIds: [],
      },
      {
        resultsPage: [arrayOfDelegators[1]],
        moreResult: false,
        nextPagesKey: [],
      }
    );
    const groups = [
      {
        id: 'group-1',
        name: 'Group 1',
      },
      {
        id: 'group-2',
        name: 'Group 2',
      },
    ];
    const status = [
      { id: DelegationStatus.ACTIVE, name: 'deleghe.table.active' },
      { id: DelegationStatus.PENDING, name: 'deleghe.table.pending' },
      { id: DelegationStatus.REJECTED, name: 'deleghe.table.rejected' },
    ];
    const result = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState.delegationsState,
          delegations: {
            delegators: arrayOfDelegators,
          },
          groups,
        },
      },
    });

    const form = result.container.querySelector('form') as HTMLFormElement;
    const cancelButton = form.querySelector('[data-testid="cancelButton"]') as Element;
    const confirmButton = form.querySelector('[data-testid="confirmButton"]') as Element;
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    await testAutocomplete(form, 'groups', groups, true, 1, false);
    await testMultiSelect(form, 'status', status, 0, true);
    await testMultiSelect(form, 'status', status, 2, false);
    expect(cancelButton).toBeEnabled();
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain('mandate/api/v1/mandates-by-delegate?size=10');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        groups: ['group-2'],
        status: [DelegationStatus.ACTIVE, DelegationStatus.REJECTED],
        delegatorIds: [],
      });
      expect(result.container).not.toHaveTextContent(/marco verdi/i);
      expect(result.container).toHaveTextContent(/davide legato/i);
    });
    mock.reset();
    mock.restore();
  });

  it('change pagination size', async () => {
    const mock = mockApi(apiClient, 'POST', DELEGATIONS_BY_DELEGATE({ size: 20 }), 200, undefined, {
      resultsPage: [arrayOfDelegators[1]],
      moreResult: false,
      nextPagesKey: [],
    });
    const result = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState.delegationsState,
          delegations: {
            delegators: [arrayOfDelegators[0]],
          },
        },
      },
    });

    expect(result.container).toHaveTextContent(/marco verdi/i);
    expect(result.container).not.toHaveTextContent(/davide legato/i);
    const itemsPerPageSelector = result.queryByTestId('itemsPerPageSelector') as Element;
    const button = itemsPerPageSelector.querySelector('button') as Element;
    expect(button).toHaveTextContent(/10/i);
    fireEvent.click(button);
    const itemsPerPageListContainer = await waitFor(() => screen.queryByRole('presentation'));
    expect(itemsPerPageListContainer).toBeInTheDocument();
    const itemsPerPageList = await screen.findAllByRole('menuitem');
    expect(itemsPerPageList).toHaveLength(3);
    fireEvent.click(itemsPerPageList[1]!);
    await waitFor(() => {
      expect(button).toHaveTextContent(/20/i);
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain('mandate/api/v1/mandates-by-delegate?size=20');
      expect(result.container).not.toHaveTextContent(/marco verdi/i);
      expect(result.container).toHaveTextContent(/davide legato/i);
    });
    mock.reset();
    mock.restore();
  });

  it('change pagination page', async () => {
    const mock = mockApi(
      apiClient,
      'POST',
      DELEGATIONS_BY_DELEGATE({ size: 10, nextPageKey: 'page-1' }),
      200,
      undefined,
      {
        resultsPage: [arrayOfDelegators[1]],
        moreResult: false,
        nextPagesKey: [],
      }
    );
    const result = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          ...initialState.delegationsState,
          delegations: {
            delegators: [arrayOfDelegators[0]],
          },
          pagination: {
            nextPagesKey: ['page-1', 'page-2', 'page-3'],
            moreResult: false,
          },
        },
      },
    });

    expect(result.container).toHaveTextContent(/marco verdi/i);
    expect(result.container).not.toHaveTextContent(/davide legato/i);
    const pageSelector = result.queryByTestId('pageSelector') as Element;
    const pageButtons = pageSelector.querySelectorAll('button');
    // depends on mui pagination
    // for 10 pages we have: < 1 2 3 >
    expect(pageButtons).toHaveLength(5);
    expect(pageButtons[1]).toHaveTextContent(/1/i);
    expect(pageButtons[2]).toHaveTextContent(/2/i);
    expect(pageButtons[3]).toHaveTextContent(/3/i);
    fireEvent.click(pageButtons[2]);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toContain(
        'mandate/api/v1/mandates-by-delegate?size=10&nextPageKey=page-1'
      );
      expect(result.container).not.toHaveTextContent(/marco verdi/i);
      expect(result.container).toHaveTextContent(/davide legato/i);
    });
    mock.reset();
    mock.restore();
  });
});

describe('DelegationsOfTheCompany Component - different API behaviors', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    apiOutcomeTestHelper.setStandardMock();
  });

  afterEach(() => {
    apiOutcomeTestHelper.clearMock();
  });

  it('API error', async () => {
    await act(
      async () =>
        void render(<DelegationsOfTheCompany />, {
          preloadedState: {
            appState: apiOutcomeTestHelper.appStateWithMessageForAction(
              DELEGATION_ACTIONS.GET_DELEGATORS
            ),
          },
        })
    );
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });

  it('API OK', async () => {
    await act(async () => void render(<DelegationsOfTheCompany />));
    apiOutcomeTestHelper.expectApiOKComponent(screen);
  });
});
