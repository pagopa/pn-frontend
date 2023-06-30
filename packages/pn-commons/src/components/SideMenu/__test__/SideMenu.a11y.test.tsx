import * as React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { render } from '../../../test-utils';
import SideMenu from '../SideMenu';
import { sideMenuItems } from './test-utils';

expect.extend(toHaveNoViolations);

describe('SideMenu - accessibility tests', () => {
  it('sidemenu accesibility', async () => {
    const { container } = render(<SideMenu menuItems={sideMenuItems} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
