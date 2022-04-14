import * as redux from 'react-redux';

import { render } from "../../__test__/test-utils";
import * as hooks from '../../redux/hooks';
import * as actions from '../../redux/contact/actions';
import Contacts from "../Contacts.page";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
  Trans: (props: {i18nKey: string}) => props.i18nKey,
}));

jest.mock('../../component/Contacts/InsertLegalContact', () => () => <div>InsertLegalContact</div>);
jest.mock('../../component/Contacts/CourtesyContacts', () => () => <div>CourtesyContacts</div>);

describe('Contacts page', () => {

  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();
  let appSelectorSpy: jest.SpyInstance;

  beforeEach(() => {
    // mock app selector
    appSelectorSpy = jest.spyOn(hooks, 'useAppSelector');
    // mock action
    const actionSpy = jest.spyOn(actions, 'getDigitalAddresses');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  })
  
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  })

  it('renders Contacts (no contacts)', () => {
    appSelectorSpy
      .mockReturnValueOnce('mocked-recipientId')
      .mockReturnValueOnce({
        legal: [],
        courtesy: []
      });
    // render component
    const result = render(<Contacts />);
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/InsertLegalContact/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith('mocked-recipientId');
  });
});