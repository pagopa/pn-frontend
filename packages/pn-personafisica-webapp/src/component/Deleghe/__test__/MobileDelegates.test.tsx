import { act, screen } from '@testing-library/react';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import * as hooks from '../../../redux/hooks';
import { arrayOfDelegates } from '../../../redux/delegation/__test__/test.utils';
import { DELEGATION_ACTIONS } from '../../../redux/delegation/actions';
import MobileDelegates from '../MobileDelegates';

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


describe('MobileDelegates Component - assuming delegates API works properly', () => {
  it('renders the empty state', () => {
    const result = render(<MobileDelegates />);

    expect(result.container).toHaveTextContent(/deleghe.delegatesTitle/i);
    expect(result.container).toHaveTextContent(/deleghe.add/i);
    expect(result.container).toHaveTextContent(/deleghe.no_delegates/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.name/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationStart/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationEnd/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.permissions/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.status/i);
  });

  it('renders the delegates', () => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegates);
    const result = render(<MobileDelegates />);

    expect(result.container).toHaveTextContent(/marco verdi/i);
    expect(result.container).toHaveTextContent(/davide legato/i);
    expect(result.container).not.toHaveTextContent(/luca blu/i);
  });
});


describe('MobileDelegates Component - different delegates API behaviors', () => {
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
      <MobileDelegates />,
      { preloadedState: { appState: apiOutcomeTestHelper.appStateWithMessageForAction(DELEGATION_ACTIONS.GET_DELEGATES) } }
    ));
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });

  it('API OK', async () => {
    await act(async () => void render(<MobileDelegates />));
    apiOutcomeTestHelper.expectApiOKComponent(screen);
  });
});
