import { axe, toHaveNoViolations } from 'jest-axe';
import * as React from 'react';

import { sideMenuItems } from '../../../__mocks__/SideMenu.mock';
import { render } from '../../../test-utils';
import SideMenu from '../SideMenu';

expect.extend(toHaveNoViolations);

describe('SideMenu - accessibility tests', () => {
  it('sidemenu accesibility', async () => {
    const { container } = render(<SideMenu menuItems={sideMenuItems} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
