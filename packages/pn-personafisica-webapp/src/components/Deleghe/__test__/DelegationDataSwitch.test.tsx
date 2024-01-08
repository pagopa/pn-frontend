import React from 'react';
import { vi } from 'vitest';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { render } from '../../../__test__/test-utils';
import delegationToItem from '../../../utility/delegation.utility';
import { DelegationStatus, getDelegationStatusKeyAndColor } from '../../../utility/status.utility';
import DelegationDataSwitch from '../DelegationDataSwitch';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const data = {
  ...delegationToItem(arrayOfDelegators)[0],
};

describe('DowntimeLogDataSwitch Component', () => {
  it('renders component - name', () => {
    const { container } = render(
      <DelegationDataSwitch data={data} type="name" menuType="delegators" />
    );
    const regexp = new RegExp(`^${data.name}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - startDate', () => {
    const { container } = render(
      <DelegationDataSwitch data={data} type="startDate" menuType="delegators" />
    );
    const regexp = new RegExp(`^${data.startDate}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - endDate', () => {
    const { container } = render(
      <DelegationDataSwitch data={data} type="endDate" menuType="delegators" />
    );
    const regexp = new RegExp(`^${data.endDate}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - visibilityIds', () => {
    const { container } = render(
      <DelegationDataSwitch data={data} type="visibilityIds" menuType="delegators" />
    );
    const regexp = new RegExp(
      `^deleghe.table.notificationsFrom${data.visibilityIds.join()}$`,
      'ig'
    );
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - status', () => {
    const { getByTestId } = render(
      <DelegationDataSwitch data={data} type="status" menuType="delegators" />
    );
    const button = getByTestId('acceptButton');
    expect(button).toBeInTheDocument();
  });

  it('renders component - status active', () => {
    const { key } = getDelegationStatusKeyAndColor(DelegationStatus.ACTIVE);
    const { container, queryByTestId } = render(
      <DelegationDataSwitch
        data={{ ...data, status: DelegationStatus.ACTIVE }}
        type="status"
        menuType="delegators"
      />
    );
    const regexp = new RegExp(`^${key}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const button = queryByTestId('acceptButton');
    expect(button).not.toBeInTheDocument();
  });

  it('renders component - menu', () => {
    const { getByTestId } = render(
      <DelegationDataSwitch data={data} type="menu" menuType="delegators" />
    );
    const menu = getByTestId('delegationMenuIcon');
    expect(menu).toBeInTheDocument();
  });
});
