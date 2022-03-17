import { act, fireEvent, waitFor, RenderResult } from '@testing-library/react';
import * as redux from 'react-redux';
import * as actions from '../../../redux/notification/actions';
import { notificationToFe } from '../../../redux/notification/__test__/test-utils';
import { render } from '../../../__test__/test-utils';

import DetailDocuments from '../DetailDocuments';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

describe('Notification Detail Documents Component', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;

  beforeEach(async () => {
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch'); 
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // render component
    await act(async () => {
      result = render(<DetailDocuments notification={notificationToFe}/>);
    });
    
  });

  afterEach(() => {
    result = undefined;
    jest.clearAllMocks();
  });

  it('renders detail documents', async () => {
    expect(result?.container).toHaveTextContent(/Atti Allegati/i);
    // expect(result?.container).toHaveTextContent(/Scarica tutti gli Atti/i);
    const documentsButtons = result?.getAllByTestId('documentButton');
    expect(documentsButtons).toHaveLength(notificationToFe.documents.length);
  });

  it('test click on document button', async () => {
    const documentsButtons = result?.getAllByTestId('documentButton');
    const actionSpy = jest.spyOn(actions, 'getReceivedNotificationDocument');
    const mockActionFn = jest.fn();
    actionSpy.mockImplementation(mockActionFn);
    await waitFor(() => {
      fireEvent.click(documentsButtons![0]);
    });
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockActionFn).toHaveBeenCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({iun: notificationToFe.iun, documentIndex: 0});
  });

});