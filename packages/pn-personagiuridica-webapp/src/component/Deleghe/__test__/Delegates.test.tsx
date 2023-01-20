import { act, screen } from '@testing-library/react';
import { render } from '../../../__test__/test-utils';
import Delegates from '../Delegates';
import { arrayOfDelegates } from '../../../redux/delegation/__test__/test.utils';
import * as hooks from '../../../redux/hooks';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';
import { DELEGATION_ACTIONS } from '../../../redux/delegation/actions';

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


describe('Delegates Component - assuming delegates API works properly', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the empty state', () => {
    const result = render(<Delegates />);

    expect(result.container).toHaveTextContent(/deleghe.delegatesTitle/i);
    expect(result.container).toHaveTextContent(/deleghe.add/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.name/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationStart/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationEnd/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.permissions/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.status/i);
    expect(result.container).toHaveTextContent(/deleghe.no_delegates/i);
  });

  it('renders the delegates', () => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegates);
    const result = render(<Delegates />);

    expect(result.container).toHaveTextContent(/marco verdi/i);
    expect(result.container).toHaveTextContent(/davide legato/i);
    expect(result.container).not.toHaveTextContent(/luca blu/i);
  });
});


describe('Delegates Component - different delegates API behaviors', () => {
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
    await act(async () => void render(
      <Delegates />,
      { preloadedState: { appState: apiOutcomeTestHelper.appStateWithMessageForAction(DELEGATION_ACTIONS.GET_DELEGATES) } }
    ));
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });

  it('API OK', async () => {
    await act(async () => void render(<Delegates />));
    apiOutcomeTestHelper.expectApiOKComponent(screen);
  });
});

