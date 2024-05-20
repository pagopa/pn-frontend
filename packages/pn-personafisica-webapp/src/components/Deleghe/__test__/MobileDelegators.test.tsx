import { vi } from 'vitest';

import { mandatesByDelegate } from '../../../__mocks__/Delegations.mock';
import { render } from '../../../__test__/test-utils';
import MobileDelegators from '../MobileDelegators';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('MobileDelegators Component', () => {
  it('renders the empty state', () => {
    const { container, queryAllByTestId } = render(<MobileDelegators />);
    expect(container).toHaveTextContent(/deleghe.delegatorsTitle/i);
    const itemCards = queryAllByTestId('mobileDelegatorsCards');
    expect(itemCards).toHaveLength(0);
    expect(container).toHaveTextContent(/deleghe.no_delegators/i);
  });

  it('renders the delegators', () => {
    const { getAllByTestId } = render(<MobileDelegators />, {
      preloadedState: { delegationsState: { delegations: { delegators: mandatesByDelegate } } },
    });
    const itemCards = getAllByTestId('mobileDelegatorsCards');
    expect(itemCards).toHaveLength(mandatesByDelegate.length);
    itemCards.forEach((card, index) => {
      expect(card).toHaveTextContent(mandatesByDelegate[index].delegator?.displayName!);
    });
  });

  /* Manca nella parte mobile, ma per coerenza andrebbe aggiunto
  it('sorts the delegators', async () => {
    
  });
  */
});
