import * as redux from 'react-redux';
import { fireEvent, RenderResult } from '@testing-library/react';

import * as actions from '../../redux/notification/actions';
import * as hooks from '../../redux/hooks';
import { notificationToFe } from '../../redux/notification/__test__/test-utils';
import { render, axe } from '../../__test__/test-utils';
import NotificationDetail from '../NotificationDetail.page';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'mocked-id' }),
  useNavigate: () => mockNavigateFn,
}));
jest.mock('@pagopa-pn/pn-commons', () => ({
  ...jest.requireActual('@pagopa-pn/pn-commons'),
  NotificationDetailTable: () => <div>Table</div>,
  NotificationDetailDocuments: ({ clickHandler }: { clickHandler: () => void }) => (
    <div data-testid="documentButton" onClick={() => clickHandler()}>
      Documents
    </div>
  ),
  NotificationDetailTimeline: ({ clickHandler }: { clickHandler: () => void }) => (
    <div data-testid="legalFactButton" onClick={() => clickHandler()}>
      Timeline
    </div>
  ),
}));

describe('NotificationDetail Page', () => {
  let result: RenderResult | undefined;
  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();

  beforeEach(async () => {
    // mock app selector
    const spy = jest.spyOn(hooks, 'useAppSelector');
    spy
      .mockReturnValueOnce(notificationToFe)
      .mockReturnValueOnce('mocked-sender')
      .mockReturnValueOnce('mocked-download-url')
      .mockReturnValueOnce('mocked-legal-fact-url');
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // mock action
    const actionSpy = jest.spyOn(actions, 'getSentNotification');
    actionSpy.mockImplementation(mockActionFn);
    // render component
    result = render(<NotificationDetail />);
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockDispatchFn.mockClear();
    mockDispatchFn.mockReset();
    mockActionFn.mockClear();
    mockActionFn.mockReset();
  });

  test('renders NotificationDetail page', () => {
    expect(result?.getByRole('link')).toHaveTextContent(/Notifiche/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationToFe.subject);
    expect(result?.container).toHaveTextContent(/Table/i);
    expect(result?.container).toHaveTextContent(/Documents/i);
    expect(result?.container).toHaveTextContent(/Timeline/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith('mocked-id');
  });

  test('executes the document and legal fact download handler', () => {
    const documentButton = result?.getByTestId('documentButton');
    const legalFactButton = result?.getByTestId('legalFactButton');
    expect(mockDispatchFn).toBeCalledTimes(1);
    fireEvent.click(documentButton!);
    expect(mockDispatchFn).toBeCalledTimes(2);
    fireEvent.click(legalFactButton!);
    expect(mockDispatchFn).toBeCalledTimes(3);
  });

  test('clicks on the back button', () => {
    const backButton = result?.getByRole('button', { name: /indietro/i });
    fireEvent.click(backButton!);
    expect(mockNavigateFn).toBeCalledTimes(1);
  });

  it('does not have basic accessibility issues rendering the page', async () => {
    if(result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });
});
