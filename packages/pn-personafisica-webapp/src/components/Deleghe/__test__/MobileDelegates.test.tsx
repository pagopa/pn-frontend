import { vi } from 'vitest';

import { mandatesByDelegator } from '../../../__mocks__/Delegations.mock';
import { fireEvent, render, waitFor, within } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import MobileDelegates from '../MobileDelegates';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('MobileDelegates Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the empty state', () => {
    const { container, queryAllByTestId, getByTestId } = render(<MobileDelegates />);
    expect(container).toHaveTextContent(/deleghe.delegatesTitle/i);
    const addDelegation = getByTestId('add-delegation');
    expect(addDelegation).toBeInTheDocument();
    const itemCards = queryAllByTestId('mobileDelegatesCards');
    expect(itemCards).toHaveLength(0);
    expect(container).toHaveTextContent(/deleghe.add/i);
    expect(container).toHaveTextContent(/deleghe.no_delegates/i);
    // clicks on empty state action
    const button = getByTestId('link-add-delegate');
    fireEvent.click(button);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NUOVA_DELEGA);
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
      preloadedState: { delegationsState: { delegations: { delegates: mandatesByDelegator } } },
    });
    const itemCards = getAllByTestId('mobileDelegatesCards');
    expect(itemCards).toHaveLength(mandatesByDelegator.length);
    itemCards.forEach((card, index) => {
      expect(card).toHaveTextContent(mandatesByDelegator[index].delegate?.displayName!);
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
          delegations: { delegates: mandatesByDelegator },
        },
      },
    });
    // get first row
    const itemCards = getAllByTestId('mobileDelegatesCards');
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
    const textbox = within(dialog).getByRole('textbox');
    expect(textbox).toHaveValue(mandatesByDelegator[0].verificationCode);

    const copyBtn = within(dialog).getByTestId('copyCodeButton');
    expect(copyBtn).toBeInTheDocument();
  });
});
