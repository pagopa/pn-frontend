import React from 'react';
import { vi } from 'vitest';

import { Row } from '@pagopa-pn/pn-commons';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { render } from '../../../__test__/test-utils';
import { DelegationColumnData } from '../../../models/Deleghe';
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
  ...(delegationToItem(arrayOfDelegators)[0] as Row<DelegationColumnData>),
};

describe('DowntimeLogDataSwitch Component', () => {
  it('renders component - name', () => {
    const { container } = render(
      <DelegationDataSwitch data={data} type="name" menuType="delegators" onAction={() => {}} />
    );
    const regexp = new RegExp(`^${data.name}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - startDate', () => {
    const { container } = render(
      <DelegationDataSwitch
        data={data}
        type="startDate"
        menuType="delegators"
        onAction={() => {}}
      />
    );
    const regexp = new RegExp(`^${data.startDate}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - endDate', () => {
    const { container } = render(
      <DelegationDataSwitch data={data} type="endDate" menuType="delegators" onAction={() => {}} />
    );
    const regexp = new RegExp(`^${data.endDate}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - visibilityIds', () => {
    const { container } = render(
      <DelegationDataSwitch
        data={data}
        type="visibilityIds"
        menuType="delegators"
        onAction={() => {}}
      />
    );
    const regexp = new RegExp(
      `^deleghe.table.notificationsFrom${data.visibilityIds.join()}$`,
      'ig'
    );
    expect(container).toHaveTextContent(regexp);
  });

  it('renders component - status', () => {
    const { getByTestId } = render(
      <DelegationDataSwitch data={data} type="status" menuType="delegators" onAction={() => {}} />
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
        onAction={() => {}}
      />
    );
    const regexp = new RegExp(`^${key}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const button = queryByTestId('acceptButton');
    expect(button).not.toBeInTheDocument();
  });

  it('renders component - groups', () => {
    const groupData = {
      ...data,
      groups: [
        { id: 'group-1', name: 'Group1' },
        { id: 'group-2', name: 'Group2' },
        { id: 'group-3', name: 'Group3' },
      ],
    };
    const { container, queryByTestId } = render(
      <DelegationDataSwitch
        data={groupData}
        type="groups"
        menuType="delegators"
        onAction={() => {}}
      />
    );
    const regexp = new RegExp(`^${groupData.groups.map((g) => g.name).join('')}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
    const button = queryByTestId('acceptButton');
    expect(button).not.toBeInTheDocument();
  });

  it('renders component - menu', () => {
    const { getByTestId } = render(
      <DelegationDataSwitch data={data} type="menu" menuType="delegators" onAction={() => {}} />
    );
    const menu = getByTestId('delegationMenuIcon');
    expect(menu).toBeInTheDocument();
  });
});
