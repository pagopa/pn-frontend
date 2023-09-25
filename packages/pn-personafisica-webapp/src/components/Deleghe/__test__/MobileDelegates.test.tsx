import React from 'react';

import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

import { arrayOfDelegates } from '../../../__mocks__/Delegations.mock';
import { fireEvent, render, screen, waitFor, within } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import { DELEGATION_ACTIONS } from '../../../redux/delegation/actions';
import MobileDelegates from '../MobileDelegates';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('MobileDelegates Component', () => {
  it('renders the empty state', () => {
    const { container, queryAllByTestId, getByTestId } = render(<MobileDelegates />);
    expect(container).toHaveTextContent(/deleghe.delegatesTitle/i);
    const addDelegation = getByTestId('add-delegation');
    expect(addDelegation).toBeInTheDocument();
    const itemCards = queryAllByTestId('itemCard');
    expect(itemCards).toHaveLength(0);
    expect(container).toHaveTextContent(/deleghe.add/i);
    expect(container).toHaveTextContent(/deleghe.no_delegates/i);
  });

  it('navigates to the add delegation page', () => {
    const { getByTestId } = render(<MobileDelegates />);
    const addDelegation = getByTestId('add-delegation');
    fireEvent.click(addDelegation);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_DELEGA);
  });

  it('renders the delegates', () => {
    const { getAllByTestId } = render(<MobileDelegates />, {
      preloadedState: { delegationsState: { delegations: { delegates: arrayOfDelegates } } },
    });
    const itemCards = getAllByTestId('itemCard');
    expect(itemCards).toHaveLength(arrayOfDelegates.length);
    itemCards.forEach((card, index) => {
      expect(card).toHaveTextContent(arrayOfDelegates[index].delegate?.displayName!);
    });
  });

  /* Manca nella parte mobile, ma per coerenza andrebbe aggiunto
  it('sorts the delegates', async () => {
    
  });
  */

  it('shows verification code', async () => {
    const { getByTestId, getAllByTestId } = render(<MobileDelegates />, {
      preloadedState: {
        delegationsState: {
          delegations: { delegates: arrayOfDelegates },
        },
      },
    });
    // get first row
    const itemCards = getAllByTestId('itemCard');
    const delegationMenuIcon = within(itemCards[0]).getByTestId('delegationMenuIcon');
    // open menu
    fireEvent.click(delegationMenuIcon);
    const showCode = await waitFor(() => getByTestId('menuItem-showCode'));
    // show code dialog
    fireEvent.click(showCode);
    const dialog = await waitFor(() => getByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('deleghe.show_code_title');
    expect(dialog).toHaveTextContent('deleghe.show_code_subtitle');
    expect(dialog).toHaveTextContent('deleghe.close');
    expect(dialog).toHaveTextContent('deleghe.verification_code');
    const codeInputs = dialog?.querySelectorAll('input');
    const codes = arrayOfDelegates[0].verificationCode.split('');
    codeInputs?.forEach((input, index) => {
      expect(input).toHaveValue(codes[index]);
    });
  });

  it('API error', async () => {
    render(<MobileDelegates />, {
      preloadedState: {
        appState: apiOutcomeTestHelper.appStateWithMessageForAction(
          DELEGATION_ACTIONS.GET_DELEGATES
        ),
      },
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${DELEGATION_ACTIONS.GET_DELEGATES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
