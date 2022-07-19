import * as redux from 'react-redux';
import { axe, render } from '../../__test__/test-utils';
import { act, fireEvent, RenderResult } from '@testing-library/react';
import * as actions from '../../redux/contact/actions';
import Contacts from '../Contacts.page';
import { PROFILO } from '../../navigation/routes.const';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

const mockNavigateFn = jest.fn();
// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('../../component/Contacts/InsertLegalContact', () => () => <div>InsertLegalContact</div>);
jest.mock('../../component/Contacts/CourtesyContacts', () => () => <div>CourtesyContacts</div>);
jest.mock('../../component/Contacts/IoContact', () => () => <div>IOContact</div>);

const initialState =  {
  preloadedState: {
    userState: {
      user: {
        uid: 'mocked-recipientId'
      }
    },
    contactsState: {
      digitalAddresses: {
        legal: [],
        courtesy: []
      }
    }
  }
};

describe('Contacts page', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  const mockActionFn = jest.fn();

  beforeEach(async() => {
    mockDispatchFn = jest.fn(() => Promise.resolve(null));

    // mock action
    const actionSpy = jest.spyOn(actions, 'getDigitalAddresses');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);

    // render component
    await act(async() => {
      result = render(<Contacts />, initialState);
    })
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders Contacts (no contacts)', () => {
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    expect(result.container).toHaveTextContent(/InsertLegalContact/i);
    expect(result.container).toHaveTextContent(/CourtesyContacts/i);
    expect(result.container).toHaveTextContent(/IOContact/i);
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith('mocked-recipientId');
  });

  it('subtitle link properly redirects to profile page', () => {

    const subtitleLink = result.getByText('subtitle-link');
    expect(subtitleLink).toBeInTheDocument();

    fireEvent.click(subtitleLink);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(PROFILO);
  });

  it('is contact page accessible', async () => {
    const { container } = result;
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
