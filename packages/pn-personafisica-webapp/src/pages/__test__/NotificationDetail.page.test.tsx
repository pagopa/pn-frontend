import * as redux from 'react-redux';
import { RenderResult } from '@testing-library/react';

import { NotificationDetail as INotificationDetail, NotificationDetailTableRow } from '@pagopa-pn/pn-commons';
import * as actions from '../../redux/notification/actions';
import * as hooks from '../../redux/hooks';
import { getCancelledNotification, getNotification, getUnavailableDocsNotification, notificationFromBe, notificationFromBeTwoRecipients } from '../../redux/notification/__test__/test-utils';
import { axe, render } from '../../__test__/test-utils';
import NotificationDetail from '../NotificationDetail.page';

const mockUseParamsFn = jest.fn();

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParamsFn()
}));

jest.mock('@pagopa-pn/pn-commons', () => ({
  ...jest.requireActual('@pagopa-pn/pn-commons'),
  NotificationDetailTable: ({rows}: {rows: Array<NotificationDetailTableRow>}) => <div>Table {rows[1].value}</div>,
  // NotificationDetailDocuments: () => <div>Documents</div>,
  NotificationDetailTimeline: () => <div>Timeline</div>,
}));

jest.mock('../../component/Notifications/NotificationPayment', () => () => <div>Payment</div>);

describe('NotificationDetail Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;
  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();

  const renderComponent = (notification: INotificationDetail, options: { userFiscalNumber? : string;  delegatorFiscalNumber?: string; isDelegate?: boolean } = {}) => {
    const { userFiscalNumber, delegatorFiscalNumber, isDelegate } = options;

    const fixedMandateId = 'ALFA-BETA-GAMMA';
    // mock query params
    const basicMockedQueryParams = { id: 'mocked-id' };
    const mockedQueryParams = delegatorFiscalNumber && isDelegate ? {...basicMockedQueryParams, mandateId: fixedMandateId } : basicMockedQueryParams; 
    mockUseParamsFn.mockReturnValue(mockedQueryParams);

    // mock app selector
    const delegators = delegatorFiscalNumber && isDelegate ? [{ mandateId: fixedMandateId, delegator: { fiscalCode: delegatorFiscalNumber }}] : [];
    const spy = jest.spyOn(hooks, 'useAppSelector');
    spy
      .mockReturnValueOnce({ fiscal_number: userFiscalNumber || "mocked-user"})
      .mockReturnValueOnce(delegators)
      .mockReturnValueOnce(notification)
      .mockReturnValueOnce('mocked-download-url')
      .mockReturnValueOnce('mocked-legal-fact-url')
      .mockReturnValueOnce({ legalDomicile: [] });

    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // mock action
    const actionSpy = jest.spyOn(actions, 'getReceivedNotification');
    actionSpy.mockImplementation(mockActionFn);
    // render component
    return render(<NotificationDetail />);
  };

  const resetResult = () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockDispatchFn.mockClear();
    mockDispatchFn.mockReset();
    mockActionFn.mockClear();
    mockActionFn.mockReset();
    return undefined;
  };

  test('renders NotificationDetail page with payment box', async () => {
    result = renderComponent(notificationFromBe, { userFiscalNumber: 'CGNNMO80A03H501U' });
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationFromBe.subject);
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent("detail.acts");
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(result?.container).toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({ iun: 'mocked-id', mandateId: undefined });
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page without payment box if noticeCode is empty', async () => {
    result = renderComponent(getNotification({ noticeCode: "" }));
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationFromBe.subject);
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent("detail.acts");
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(result?.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({ iun: 'mocked-id', mandateId: undefined });
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page without payment box if creditorTaxId is empty', async () => {
    result = renderComponent(getNotification({ creditorTaxId: "" }));
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationFromBe.subject);
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent("detail.acts");
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(result?.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({ iun: 'mocked-id', mandateId: undefined });
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page without payment box if noticeCode and creditorTaxId are both empty', async () => {
    result = renderComponent(getNotification({ creditorTaxId: "", noticeCode: "" }));
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationFromBe.subject);
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent("detail.acts");
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(result?.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({ iun: 'mocked-id', mandateId: undefined });
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page without payment box if payment object is not defined', async () => {
    result = renderComponent(getNotification());
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationFromBe.subject);
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent("detail.acts");
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(result?.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({ iun: 'mocked-id', mandateId: undefined });
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail if documents are available', async () => {
    result = renderComponent(getNotification());
    
    const downloadDocumentBtn = result.getByRole("button", { name: "Mocked document" });
    expect(downloadDocumentBtn).toBeInTheDocument();

    const documentsText = result.getByText("detail.acts_files.downloadable_acts");
    expect(documentsText).toBeInTheDocument();

    result = resetResult();
  });

  test('renders NotificationDetail if documents are not available', async () => {
    result = renderComponent(getUnavailableDocsNotification());
    
    const documentTitle = result.queryByText("Mocked document");
    expect(documentTitle).toBeInTheDocument();

    const documentsText = result.getByText("detail.acts_files.not_downloadable_acts");
    expect(documentsText).toBeInTheDocument();

    result = resetResult();
  });

  test('renders NotificationDetail if status is cancelled', async () => {
    result = renderComponent(getCancelledNotification());
    
    // payment component and documents should be hidden if notification
    // status is "cancelled" even though documentsAvailable is true
    const documentTitle = result.queryByText("Mocked document");
    expect(documentTitle).not.toBeInTheDocument();
    expect(result?.container).not.toHaveTextContent(/Payment/i);

    const documentsText = result.getByText("detail.acts_files.notification_cancelled");
    expect(documentsText).toBeInTheDocument();
  });

  test('renders NotificationDetail page with the first recipient logged', async () => {
    result = renderComponent(notificationFromBeTwoRecipients, { userFiscalNumber: 'TTTUUU29J84Z600X', delegatorFiscalNumber: 'CGNNMO80A03H501U', isDelegate: false});
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent('Totito');
    expect(result?.container).not.toHaveTextContent('Analogico Ok');
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page with the second recipient logged', async () => {
    result = renderComponent(notificationFromBeTwoRecipients, { userFiscalNumber: 'CGNNMO80A03H501U', delegatorFiscalNumber: 'TTTUUU29J84Z600X', isDelegate: false});
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent('Analogico Ok');
    expect(result?.container).not.toHaveTextContent('Totito');
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page with current delegator as first recipient', async () => {
    result = renderComponent(notificationFromBeTwoRecipients, { userFiscalNumber: 'CGNNMO80A03H501U', delegatorFiscalNumber: 'TTTUUU29J84Z600X', isDelegate: true});
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent('Totito');
    expect(result?.container).not.toHaveTextContent('Analogico Ok');
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page with current delegator as second recipient', async () => {
    result = renderComponent(notificationFromBeTwoRecipients, { userFiscalNumber: 'TTTUUU29J84Z600X', delegatorFiscalNumber: 'CGNNMO80A03H501U', isDelegate: true});
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent('Analogico Ok');
    expect(result?.container).not.toHaveTextContent('Totito');
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

});
