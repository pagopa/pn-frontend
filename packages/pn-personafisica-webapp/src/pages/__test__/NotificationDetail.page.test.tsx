import * as redux from 'react-redux';
import { RenderResult, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import * as routes from '../../navigation/routes.const';

import {
  apiOutcomeTestHelper,
  NotificationDetail as INotificationDetail,
  NotificationDetailTableRow,
  NotificationStatus,
} from '@pagopa-pn/pn-commons';
import { axe, render } from '../../__test__/test-utils';
import * as actions from '../../redux/notification/actions';
import {
  fixedMandateId,
  notificationToFe,
  notificationToFeTwoRecipients,
  overrideNotificationMock,
} from '../../redux/notification/__test__/test-utils';
import NotificationDetail from '../NotificationDetail.page';

const mockUseParamsFn = jest.fn();

/* eslint-disable functional/no-let */
let mockReactRouterState: any;
let mockUseSimpleBreadcrumb = false;
/* eslint-enable functional/no-let */

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
      t: (str: string) => str,
    }),
}));

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useParams: () => mockUseParamsFn(),
    useLocation: () => ({ ...original.useLocation(), state: mockReactRouterState }),
  };
});

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  const OriginalPnBreadcrumb = original.PnBreadcrumb;
  return {
    ...original,
    NotificationDetailTable: ({ rows }: { rows: Array<NotificationDetailTableRow> }) => (
      <div>Table {rows[1].value}</div>
    ),
    // NotificationDetailDocuments: () => <div>Documents</div>,
    NotificationDetailTimeline: () => <div>Timeline</div>,
    ApiError: () => <div>Api Error</div>,
    PnBreadcrumb: (props: any) => mockUseSimpleBreadcrumb ? <div data-testid="mock-breadcrumb-link">{props.linkRoute}</div> : <OriginalPnBreadcrumb {...props} />,
  }
});

jest.mock('../../component/Notifications/NotificationPayment', () => () => <div>Payment</div>);

describe('NotificationDetail Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  const mockActionFn = jest.fn();

  const mockedUserInStore = { fiscal_number: 'mocked-user' };

  /*
   * The second parameter allows to simulate that the logged user is a delegate for the 
   * notification being rendered.
   * It must be passed in an additional parameter because it would be cumbersome (if not impossible)
   * to know whether the logged user is a recipient or a delegate based solely
   * in the notification object. 
   * If the notification is build using the function notificationToFeTwoRecipients, 
   * which includes a parameter that also indicates that the notification detail is requested 
   * by a recipient or a delegate, then unfortunately the same information is told twice,
   * to notificationToFeTwoRecipients and to renderComponent.
   * But I found no easy solution, so I prefer to keep the test source code as it is.
   * -----------------------------------------
   * Carlos Lombardi, 2022.11.21
   */
  const renderComponent = (notification: INotificationDetail, mandateId?: string) => {
    // mock query params
    const mockedQueryParams: {id: string, mandateId?: string} = { id: 'mocked-id' };
    if (mandateId) {
      // eslint-disable-next-line functional/immutable-data
      mockedQueryParams.mandateId= mandateId;
    }
    mockUseParamsFn.mockReturnValue(mockedQueryParams);

    // mock Redux store state
    const reduxStoreState = {
      userState: { user: mockedUserInStore },
      notificationState: {
        notification,
        documentDownloadUrl: 'mocked-download-url',
        legalFactDownloadUrl: 'mocked-legal-fact-url',
      },
    };

    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // mock action
    const actionSpy = jest.spyOn(actions, 'getReceivedNotification');
    actionSpy.mockImplementation(mockActionFn);
    // render component
    return render(<NotificationDetail />, { preloadedState: reduxStoreState });
  };

  beforeEach(() => {
    mockDispatchFn = jest.fn(() => ({
      then: () => Promise.resolve(),
    }));
    mockReactRouterState = {};
    mockUseSimpleBreadcrumb = false;
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockDispatchFn.mockClear();
    mockDispatchFn.mockReset();
    mockActionFn.mockClear();
    mockActionFn.mockReset();
  });

  test('renders NotificationDetail page with payment box', async () => {
    result = renderComponent(notificationToFe);
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent(/Table/i);
    expect(result.container).toHaveTextContent('detail.acts');
    expect(result.container).toHaveTextContent(/Timeline/i);
    expect(result.container).toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      iun: 'mocked-id',
      currentUserTaxId: mockedUserInStore.fiscal_number,
      delegatorsFromStore: [],
      mandateId: undefined,
    });
    // expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  });

  test('renders NotificationDetail page without payment box if noticeCode is empty', async () => {
    result = renderComponent(overrideNotificationMock({recipients: [{payment: { noticeCode: '' }}]}));
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent(/Table/i);
    expect(result.container).toHaveTextContent('detail.acts');
    expect(result.container).toHaveTextContent(/Timeline/i);
    expect(result.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      iun: 'mocked-id',
      currentUserTaxId: mockedUserInStore.fiscal_number,
      delegatorsFromStore: [],
      mandateId: undefined,
    });
    // expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  });

  test('renders NotificationDetail page without payment box if creditorTaxId is empty', async () => {
    result = renderComponent(overrideNotificationMock({recipients: [{payment: { creditorTaxId: '' }}]}));
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent(/Table/i);
    expect(result.container).toHaveTextContent('detail.acts');
    expect(result.container).toHaveTextContent(/Timeline/i);
    expect(result.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      iun: 'mocked-id',
      currentUserTaxId: mockedUserInStore.fiscal_number,
      delegatorsFromStore: [],
      mandateId: undefined,
    });
    // expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  });

  test('renders NotificationDetail page without payment box if noticeCode and creditorTaxId are both empty', async () => {
    result = renderComponent(overrideNotificationMock({recipients: [{payment: { creditorTaxId: '', noticeCode: '' }}]}));
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent(/Table/i);
    expect(result.container).toHaveTextContent('detail.acts');
    expect(result.container).toHaveTextContent(/Timeline/i);
    expect(result.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      iun: 'mocked-id',
      currentUserTaxId: mockedUserInStore.fiscal_number,
      delegatorsFromStore: [],
      mandateId: undefined,
    });
   // expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  });

  test('renders NotificationDetail page without payment box if payment object is not defined', async () => {
    result = renderComponent(overrideNotificationMock({recipients: [{payment: undefined}]}));
    expect(result.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent(/Table/i);
    expect(result.container).toHaveTextContent('detail.acts');
    expect(result.container).toHaveTextContent(/Timeline/i);
    expect(result.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      iun: 'mocked-id',
      currentUserTaxId: mockedUserInStore.fiscal_number,
      delegatorsFromStore: [],
      mandateId: undefined,
    });
    expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  });

  test('renders NotificationDetail if documents are available', async () => {
    result = renderComponent(notificationToFe);
    const downloadDocumentBtn = result.getByRole('button', { name: 'Mocked document' });
    expect(downloadDocumentBtn).toBeInTheDocument();
    const documentsText = result.getByText('detail.acts_files.downloadable_acts');
    expect(documentsText).toBeInTheDocument();
  });

  test('renders NotificationDetail if documents are not available', async () => {
    result = renderComponent(overrideNotificationMock({documentsAvailable: false}));
    const documentTitle = result.queryByText('Mocked document');
    expect(documentTitle).toBeInTheDocument();
    const documentsText = result.getByText('detail.acts_files.not_downloadable_acts');
    expect(documentsText).toBeInTheDocument();
  });

  test('renders NotificationDetail if status is cancelled', async () => {
    result = renderComponent(overrideNotificationMock({notificationStatus: NotificationStatus.CANCELLED}));
    // payment component and documents should be hidden if notification
    // status is "cancelled" even though documentsAvailable is true
    const documentTitle = result.queryByText('Mocked document');
    expect(documentTitle).not.toBeInTheDocument();
    expect(result.container).not.toHaveTextContent(/Payment/i);
    const documentsText = result.getByText('detail.acts_files.notification_cancelled');
    expect(documentsText).toBeInTheDocument();
  });

  test('renders NotificationDetail page with the first recipient logged', async () => {
    result = renderComponent(
      notificationToFeTwoRecipients('TTTUUU29J84Z600X', 'CGNNMO80A03H501U', false)
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent('Totito');
    expect(result.container).not.toHaveTextContent('Analogico Ok');
    // expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  });

  test('renders NotificationDetail page with the second recipient logged', async () => {
    result = renderComponent(
      notificationToFeTwoRecipients('CGNNMO80A03H501U', 'TTTUUU29J84Z600X', false)
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent('Analogico Ok');
    expect(result.container).not.toHaveTextContent('Totito');
    expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  });

  test('renders NotificationDetail page with current delegator as first recipient', async () => {
    result = renderComponent(
      notificationToFeTwoRecipients('CGNNMO80A03H501U', 'TTTUUU29J84Z600X', true), fixedMandateId
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent('Totito');
    expect(result.container).not.toHaveTextContent('Analogico Ok');
    // expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  });

  test('renders NotificationDetail page with current delegator as second recipient', async () => {
    result = renderComponent(
      notificationToFeTwoRecipients('TTTUUU29J84Z600X', 'CGNNMO80A03H501U', true), fixedMandateId
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent('Analogico Ok');
    expect(result.container).not.toHaveTextContent('Totito');
    // expect(await axe(result.container as Element)).toHaveNoViolations(); // Accesibility test
  });

  it('Notification detailAPI error', async () => {
    jest.restoreAllMocks();
    mockUseParamsFn.mockReturnValue({ id: 'mocked-id' });
    await act(async () => void render(
      <NotificationDetail />, 
      { preloadedState: { appState: apiOutcomeTestHelper.appStateWithMessageForAction(actions.NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION) } } 
    ));
    const apiErrorComponent = screen.queryByText("Api Error");
    expect(apiErrorComponent).toBeTruthy();
  });

  it("normal navigation - includes 'indietro' button", async () => {
    result = renderComponent(notificationToFe);
    const indietroButton = result.queryByTestId("breadcrumb-indietro-button");
    expect(indietroButton).toBeInTheDocument();
  });


  it("navigation from QR code - does not include 'indietro' button", async () => {
    mockReactRouterState = { fromQrCode: true };
    result = renderComponent(notificationToFe);
    const indietroButton = result.queryByTestId("breadcrumb-indietro-button");
    expect(indietroButton).not.toBeInTheDocument();
  });

  it("'notifiche' link for recipient", async () => {
    mockUseSimpleBreadcrumb = true;
    // Using a notification with two recipients just because it's easy to set whether
    // the logged user is the recipient or a delegate. 
    // This test could be performed using a mono-recipient notification with no implications in what it's tested.
    result = renderComponent(
      notificationToFeTwoRecipients('TTTUUU29J84Z600X', 'CGNNMO80A03H501U', false)
    );
    const breadcrumbLinkComponent = screen.queryByTestId("mock-breadcrumb-link");
    expect(breadcrumbLinkComponent).toHaveTextContent(new RegExp(`^${routes.NOTIFICHE}$`));
  });

  it("'notifiche' link for mandate", async () => {
    mockUseSimpleBreadcrumb = true;
    // Notification with two recipients: cfr. the comment in the other test about 'notifiche' link
    result = renderComponent(
      notificationToFeTwoRecipients('TTTUUU29J84Z600X', 'CGNNMO80A03H501U', true), fixedMandateId
    );
    const breadcrumbLinkComponent = screen.queryByTestId("mock-breadcrumb-link");
    expect(breadcrumbLinkComponent).toHaveTextContent(new RegExp(`^${routes.GET_NOTIFICHE_DELEGATO_PATH(fixedMandateId)}$`));
  });
});
