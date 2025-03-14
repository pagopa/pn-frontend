import { vi } from 'vitest';

import { Row } from '@pagopa-pn/pn-commons';

import { publicKeys } from '../../../__mocks__/ApiKeys.mock';
import { render } from '../../../__test__/test-utils';
import { ApiKeyColumnData } from '../../../models/ApiKeys';
import ApiKeysDataSwitch from '../ApiKeysDataSwitch';

const data: Row<ApiKeyColumnData> = {
  id: publicKeys.items[0].kid!,
  name: publicKeys.items[0].name,
  value: publicKeys.items[0].value,
  date: publicKeys.items[0].createdAt,
  status: publicKeys.items[0].status,
  statusHistory: publicKeys.items[0].statusHistory,
  menu: '',
};

describe('Api Keys Data Switch', () => {
  const mockClick = vi.fn();

  it('renders component - name', () => {
    const { container } = render(
      <ApiKeysDataSwitch
        handleModalClick={mockClick}
        keys={publicKeys}
        data={data}
        type="name"
        menuType="publicKeys"
      />
    );
    const regexp = new RegExp(`^${data.name}$`, 'ig');
    expect(container).toHaveTextContent(regexp);
  });
});
