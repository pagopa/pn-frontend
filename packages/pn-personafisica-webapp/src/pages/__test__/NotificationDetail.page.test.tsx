import * as redux from 'react-redux';
import { RenderResult } from '@testing-library/react';

import { NotificationDetail as INotificationDetail } from '@pagopa-pn/pn-commons';
import * as actions from '../../redux/notification/actions';
import * as hooks from '../../redux/hooks';
import { getCancelledNotification, getNotification, getUnavailableDocsNotification, notificationToFe } from '../../redux/notification/__test__/test-utils';
import { axe, render } from '../../__test__/test-utils';
import NotificationDetail from '../NotificationDetail.page';

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
  useParams: () => ({ id: 'mocked-id' }),
}));

jest.mock('@pagopa-pn/pn-commons', () => ({
  ...jest.requireActual('@pagopa-pn/pn-commons'),
  NotificationDetailTable: () => <div>Table</div>,
  // NotificationDetailDocuments: () => <div>Documents</div>,
  NotificationDetailTimeline: () => <div>Timeline</div>,
}));

jest.mock('../../component/Notifications/NotificationPayment', () => () => <div>Payment</div>);

describe('NotificationDetail Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;
  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();

  const renderComponent = (notification: INotificationDetail) => {
    // mock app selector
    const spy = jest.spyOn(hooks, 'useAppSelector');
    spy
      .mockReturnValueOnce(notification)
      .mockReturnValueOnce('mocked-sender')
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
    result = renderComponent(notificationToFe);
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent("detail.acts");
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(result?.container).toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({ iun: 'mocked-id', madateId: undefined });
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page without payment box if noticeCode is empty', async () => {
    result = renderComponent(getNotification({ noticeCode: "" }));
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent("detail.acts");
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(result?.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({ iun: 'mocked-id', madateId: undefined });
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page without payment box if creditorTaxId is empty', async () => {
    result = renderComponent(getNotification({ creditorTaxId: "" }));
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent("detail.acts");
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(result?.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({ iun: 'mocked-id', madateId: undefined });
    expect(await axe(result?.container as Element)).toHaveNoViolations(); // Accesibility test
    result = resetResult();
  });

  test('renders NotificationDetail page without payment box if noticeCode and creditorTaxId are both empty', async () => {
    result = renderComponent(getNotification({ creditorTaxId: "", noticeCode: "" }));
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
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
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result?.container).toHaveTextContent('mocked-abstract');
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent("detail.acts");
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(result?.container).not.toHaveTextContent(/Payment/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({ iun: 'mocked-id', madateId: undefined });
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
    
    // even if documentsAvailable is set to true the component will not display any document
    const documentTitle = result.queryByText("Mocked document");
    expect(documentTitle).not.toBeInTheDocument();

    const documentsText = result.getByText("detail.acts_files.notification_cancelled");
    expect(documentsText).toBeInTheDocument();
  });

});
