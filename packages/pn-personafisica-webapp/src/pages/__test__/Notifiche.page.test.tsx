import { act, fireEvent, RenderResult, screen, waitFor, within } from '@testing-library/react';
import * as redux from 'react-redux';
import { ApiErrorGuardGeneral, formatToTimezoneString, getNextDay, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { axe, render } from '../../__test__/test-utils';
import * as actions from '../../redux/dashboard/actions';
import * as hooks from '../../redux/hooks';
import { notificationsToFe } from '../../redux/dashboard/__test__/test-utils';
import Notifiche from '../Notifiche.page';
import { NotificationsApi } from '../../api/notifications/Notifications.api';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

// const MockApiErrorGuardGeneral = ApiErrorGuardGeneral;

// questo permette che in alcuni tests il componente "normale" sia quello proprio del componente Notifiche
// e che in altri invece sia un mock tipo <div>Ecco le notifiche</div>
let mockNotificationComponent: JSX.Element | undefined;

function mockApiErrorGuard(
  mockNormalComponentFn?: () => (JSX.Element | undefined),
  mockApiErrorComponent?: JSX.Element,
) { 
  return ({ apiId, component }: { apiId: string, component: JSX.Element }) => <ApiErrorGuardGeneral 
    apiId={apiId} component={(mockNormalComponentFn && mockNormalComponentFn()) || component} 
    errorComponent={mockApiErrorComponent || <div>Api Error</div>} 
  />;
}

/**
 * Per testare un componente che usa ApiErrorGuard, penso che non serve moccare ApiErrorGuard al completo,
 * perché la logica di renderizzare sia il componente "normale" sia ApiError serve.
 * Penso che invece sia meglio moccare i componenti "normale" e di errore.
 * 
 * Perciò ho creato questa funzione mockApiErrorGuard, che riceve in parametro appunto questi componenti.
 * - Il componente "normale" l'ho lasciato come funzione, perché a seconda di quello che si vuol testare potrebbe
 *   essere diverso in ogni test. Definito come funzione, si esegue ad ogni volta che viene invocato il mock 
 *   di ApiErrorGuard. Se non viene passato, o la funzione ritorna undefined, allora si usa lo stesso
 *   componente "normale" del componente/page che si sta testando.
 * - Il componente di errore l'ho lasciato fisso, se non viene passato si usa <div>Api Error</div>
 * 
 * Per adesso ho lasciato la definizione locale in questo file, ma si può spostare in pn-commons ... non saprei dove,
 * sarebbe corretto creare utils/test.utility.ts?
 */
jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
    ApiErrorGuard: mockApiErrorGuard(() => mockNotificationComponent),
    // ApiErrorGuard: ({ apiId, component }: { apiId: string, component: JSX.Element }) => <MockApiErrorGuardGeneral 
    //   apiId={apiId} component={mockNotificationComponent || component} errorComponent={<div>Api Error</div>} 
    // />,
  };
});

describe('Notifiche Page - with notifications', () => {
  let result: RenderResult | undefined;

  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();

  beforeEach(async () => {
    // mock app selector
    const spy = jest.spyOn(hooks, 'useAppSelector');
    spy
      .mockReturnValueOnce({
        notifications: notificationsToFe.resultsPage,
        filters: {
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(today),
          recipientId: '',
          status: '',
          subjectRegExp: '',
        },
        sort: {
          orderBy: '',
          order: 'asc',
        },
        pagination: {
          nextPagesKey: ['mocked-page-key-1', 'mocked-page-key-2', 'mocked-page-key-3'],
          size: 10,
          page: 0,
          moreResult: true,
        },
      })
      .mockReturnValueOnce({ delegators: [] })
      .mockReturnValueOnce({ legalDomicile: [] });
    // mock action
    const actionSpy = jest.spyOn(actions, 'getReceivedNotifications');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // render component
    await act(async () => {
      result = render(<Notifiche />);
    });
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders notifiche page', () => {
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent(/title/i);
    const filterForm = result?.container.querySelector('form');
    expect(filterForm).toBeInTheDocument();
    const notificationsTable = result?.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();
    const itemsPerPageSelector = result?.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result?.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
      recipientId: '',
      status: '',
      subjectRegExp: '',
      size: 10,
    });
  });

  it('changes items per page', async () => {
    const itemsPerPageSelectorBtn = result?.container.querySelector(
      '[data-testid="itemsPerPageSelector"] > button'
    );
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(itemsPerPageDropdown).toBeInTheDocument();
    const itemsPerPageItem = within(itemsPerPageDropdown!).queryByText('100');
    // reset mock dispatch function
    mockDispatchFn.mockReset();
    mockDispatchFn.mockClear();
    fireEvent.click(itemsPerPageItem!);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockDispatchFn).toBeCalledWith({
        payload: { size: 100, page: 0 },
        type: 'dashboardSlice/setPagination',
      });
    });
  });

  it('changes page', async () => {
    const pageSelectorBtn = result?.container.querySelector(
      '[data-testid="pageSelector"] li:nth-child(3) > button'
    );
    // reset mock dispatch function
    mockDispatchFn.mockReset();
    mockDispatchFn.mockClear();
    fireEvent.click(pageSelectorBtn!);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockDispatchFn).toBeCalledWith({
        payload: { size: 10, page: 1 },
        type: 'dashboardSlice/setPagination',
      });
    });
  });

  it('does not have basic accessibility issues', async () => {
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  }, 15000);
});


describe('Notifiche Page - query for notification API outcome', () => {
  beforeEach(() => {
    mockNotificationComponent = <div>Ecco le notifiche</div>;
  });

  afterEach(() => {
    mockNotificationComponent = undefined;
  });

  it('API error', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotifications');
    apiSpy.mockRejectedValue({ response: { status: 500 } });
    await act(async () => void render(<Notifiche />));
    const apiErrorComponent = screen.queryByText("Api Error");
    const notificheComponent = screen.queryByText("Ecco le notifiche");
    expect(apiErrorComponent).toBeTruthy();
    expect(notificheComponent).toEqual(null);
  });

  it('API OK', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotifications');
    apiSpy.mockResolvedValue({ resultsPage: [], moreResult: false, nextPagesKey: [] });
    await act(async () => void render(<Notifiche />));
    const apiErrorComponent = screen.queryByText("Api Error");
    const notificheComponent = screen.queryByText("Ecco le notifiche");
    expect(apiErrorComponent).toEqual(null);
    expect(notificheComponent).toBeTruthy();
  });
});
