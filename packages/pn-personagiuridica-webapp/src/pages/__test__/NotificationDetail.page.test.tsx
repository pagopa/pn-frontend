import { act } from 'react-dom/test-utils';
import { RenderResult, screen } from '@testing-library/react';
import {
  apiOutcomeTestHelper,
  NotificationDetail as INotificationDetail,
  NotificationDetailTableRow,
  NotificationStatus
} from '@pagopa-pn/pn-commons';

import * as routes from '../../navigation/routes.const';
import { render } from '../../__test__/test-utils';
import * as actions from '../../redux/notification/actions';
import {
  notificationToFe,
  notificationToFeTwoRecipients,
  overrideNotificationMock
} from '../../redux/notification/__test__/test-utils';
import NotificationDetail from '../NotificationDetail.page';
import { mockDispatchAndActions, renderComponentBase } from './NotificationDetail.page.test-utils';

const fixedMandateId = 'ALFA-BETA-GAMMA';

/* eslint-disable functional/no-let */
let mockUseParamsFn;
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
  let mockActionFn: jest.Mock;

  const mockedUserInStore = { fiscal_number: 'mocked-user' };

  const renderComponent = async (notification: INotificationDetail, mandateId?: string) => 
    renderComponentBase({ mockedUserInStore, mockDispatchFn, mockActionFn, mockUseParamsFn}, notification, mandateId);

  beforeEach(() => {
    mockUseParamsFn = jest.fn();
    mockDispatchFn = jest.fn(() => ({
      then: () => Promise.resolve(),
    }));
    mockActionFn = jest.fn();
    mockReactRouterState = {};
    mockUseSimpleBreadcrumb = false;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders NotificationDetail page with payment box', async () => {
    result = await renderComponent(notificationToFe);
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
      mandateId: undefined,
    });
  });

  test('renders NotificationDetail page without payment box if noticeCode is empty', async () => {
    result = await renderComponent(overrideNotificationMock({recipients: [{payment: { noticeCode: '' }}]}));
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
      mandateId: undefined,
    });
  });

  test('renders NotificationDetail page without payment box if creditorTaxId is empty', async () => {
    result = await renderComponent(overrideNotificationMock({recipients: [{payment: { creditorTaxId: '' }}]}));
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
      mandateId: undefined,
    });
  });

  test('renders NotificationDetail page without payment box if noticeCode and creditorTaxId are both empty', async () => {
    result = await renderComponent(overrideNotificationMock({recipients: [{payment: { creditorTaxId: '', noticeCode: '' }}]}));
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
      mandateId: undefined,
    });
  });

  test('renders NotificationDetail page without payment box if payment object is not defined', async () => {
    result = await renderComponent(overrideNotificationMock({recipients: [{payment: undefined}]}));
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
      mandateId: undefined,
    });
  });

  test('renders NotificationDetail if documents are available', async () => {
    result = await renderComponent(notificationToFe);
    const downloadDocumentBtn = result.getByRole('button', { name: 'Mocked document' });
    expect(downloadDocumentBtn).toBeInTheDocument();
    const documentsText = result.getAllByText('detail.acts_files.downloadable_acts');
    expect(documentsText.length).toBeGreaterThan(0);
  });

  test('renders NotificationDetail if documents are not available', async () => {
    result = await renderComponent(overrideNotificationMock({documentsAvailable: false}));
    const documentTitle = result.queryByText('Mocked document');
    expect(documentTitle).toBeInTheDocument();
    const documentsText = result.getAllByText('detail.acts_files.not_downloadable_acts');
    expect(documentsText.length).toBeGreaterThan(0);
  });

  test('renders NotificationDetail if status is cancelled', async () => {
    result = await renderComponent(overrideNotificationMock({notificationStatus: NotificationStatus.CANCELLED}));
    // payment component and documents should be hidden if notification
    // status is "cancelled" even though documentsAvailable is true
    const documentTitle = result.queryByText('Mocked document');
    expect(documentTitle).not.toBeInTheDocument();
    expect(result.container).not.toHaveTextContent(/Payment/i);
    const documentsText = result.getAllByText('detail.acts_files.notification_cancelled');
    expect(documentsText.length).toBeGreaterThan(0);
  });

  test('renders NotificationDetail page with the first recipient logged', async () => {
    result = await renderComponent(
      notificationToFeTwoRecipients('TTTUUU29J84Z600X', 'CGNNMO80A03H501U', false)
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent('Totito');
    expect(result.container).not.toHaveTextContent('Analogico Ok');
  });

  test('renders NotificationDetail page with the second recipient logged', async () => {
    result = await renderComponent(
      notificationToFeTwoRecipients('CGNNMO80A03H501U', 'TTTUUU29J84Z600X', false)
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent('Analogico Ok');
    expect(result.container).not.toHaveTextContent('Totito');
  });

  test('renders NotificationDetail page with current delegator as first recipient', async () => {
    result = await renderComponent(
      notificationToFeTwoRecipients('CGNNMO80A03H501U', 'TTTUUU29J84Z600X', true), fixedMandateId
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent('Totito');
    expect(result.container).not.toHaveTextContent('Analogico Ok');
  });

  test('renders NotificationDetail page with current delegator as second recipient', async () => {
    result = await renderComponent(
      notificationToFeTwoRecipients('TTTUUU29J84Z600X', 'CGNNMO80A03H501U', true), fixedMandateId
    );
    expect(result.container).toHaveTextContent('mocked-abstract');
    expect(result.container).toHaveTextContent('Analogico Ok');
    expect(result.container).not.toHaveTextContent('Totito');
  });

  it('Notification detailAPI error', async () => {
    // need to handle mocks since it does not resort to renderComponent
    mockUseParamsFn.mockReturnValue({ id: 'mocked-id' });
    mockDispatchAndActions({ mockDispatchFn, mockActionFn });
    // custom render
    await act(async () => void render(
      <NotificationDetail />, 
      { preloadedState: { appState: apiOutcomeTestHelper.appStateWithMessageForAction(actions.NOTIFICATION_ACTIONS.GET_RECEIVED_NOTIFICATION) } } 
    ));
    // verification
    const apiErrorComponent = screen.queryByText("Api Error");
    expect(apiErrorComponent).toBeTruthy();
  });

  it("normal navigation - includes 'indietro' button", async () => {
    result = await renderComponent(notificationToFe);
    const indietroButton = result.queryByTestId("breadcrumb-indietro-button");
    expect(indietroButton).toBeInTheDocument();
  });


  it("navigation from QR code - does not include 'indietro' button", async () => {
    mockReactRouterState = { fromQrCode: true };
    result = await renderComponent(notificationToFe);
    const indietroButton = result.queryByTestId("breadcrumb-indietro-button");
    expect(indietroButton).not.toBeInTheDocument();
  });

  it("'notifiche' link for recipient", async () => {
    mockUseSimpleBreadcrumb = true;
    // Using a notification with two recipients just because it's easy to set whether
    // the logged user is the recipient or a delegate. 
    // This test could be performed using a mono-recipient notification with no implications in what it's tested.
    result = await renderComponent(
      notificationToFeTwoRecipients('TTTUUU29J84Z600X', 'CGNNMO80A03H501U', false)
    );
    const breadcrumbLinkComponent = screen.queryByTestId("mock-breadcrumb-link");
    expect(breadcrumbLinkComponent).toHaveTextContent(routes.NOTIFICHE);
  });

  it("'notifiche' link for mandate", async () => {
    mockUseSimpleBreadcrumb = true;
    // Notification with two recipients: cfr. the comment in the other test about 'notifiche' link
    result = await renderComponent(
      notificationToFeTwoRecipients('TTTUUU29J84Z600X', 'CGNNMO80A03H501U', true), fixedMandateId
    );
    const breadcrumbLinkComponent = screen.queryByTestId("mock-breadcrumb-link");
    expect(breadcrumbLinkComponent).toHaveTextContent(routes.NOTIFICHE_DELEGATO);
  });
});
