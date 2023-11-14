import React from 'react';
import { vi } from 'vitest';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
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
    const itemCards = queryAllByTestId('itemCard');
    expect(itemCards).toHaveLength(0);
    expect(container).toHaveTextContent(/deleghe.no_delegators/i);
  });

  it('renders the delegators', () => {
    const { getAllByTestId } = render(<MobileDelegators />, {
      preloadedState: { delegationsState: { delegations: { delegators: arrayOfDelegators } } },
    });
    const itemCards = getAllByTestId('itemCard');
    expect(itemCards).toHaveLength(arrayOfDelegators.length);
    itemCards.forEach((card, index) => {
      expect(card).toHaveTextContent(arrayOfDelegators[index].delegator?.displayName!);
    });
  });

  /* Manca nella parte mobile, ma per coerenza andrebbe aggiunto
  it('sorts the delegators', async () => {
    
  });
  */
});
