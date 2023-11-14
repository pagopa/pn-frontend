import * as React from 'react';
import { vi } from 'vitest';

import { axe, fireEvent, render } from '../../../__test__/test-utils';
import { AcceptButton, Menu, OrganizationsList } from '../DelegationsElements';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('DelegationElements - accessibility tests', () => {
  it('is Menu component accessible - delegators', async () => {
    const { getByTestId, queryByTestId, container } = render(
      <Menu menuType={'delegators'} id={'111'} />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(closedMenu).toBeNull();
    fireEvent.click(menuIcon);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is Menu component accessible - delegates', async () => {
    const { getByTestId, queryByTestId, container } = render(
      <Menu menuType={'delegates'} id={'111'} />
    );
    const menuIcon = getByTestId('delegationMenuIcon');
    const closedMenu = queryByTestId('delegationMenu');
    expect(closedMenu).toBeNull();
    fireEvent.click(menuIcon);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is OrganizationList component accessible - no organizations', async () => {
    const { container } = render(<OrganizationsList organizations={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is OrganizationList component accessible - with organizations', async () => {
    const { container } = render(
      <OrganizationsList
        organizations={['Bollate', 'Milano', 'Abbiategrasso', 'Malpensa']}
        visibleItems={3}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is AcceptButton component accessible', async () => {
    const { container } = render(<AcceptButton id={'111'} name={'test'} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
