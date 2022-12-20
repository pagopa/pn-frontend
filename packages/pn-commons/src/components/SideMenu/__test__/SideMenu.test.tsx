import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { render } from '../../../test-utils';
import * as hooks from '../../../hooks/useIsMobile';
import SideMenu from '../SideMenu';
import { sideMenuItems } from './test-utils';

const useIsMobileSpy = jest.spyOn(hooks, 'useIsMobile');

describe('SideMenu', () => {
  afterEach(() => {
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
  });

  it('Renders side menu (no mobile)', async () => {
    useIsMobileSpy.mockReturnValue(false);
    render(<SideMenu menuItems={sideMenuItems} />);
    const ul = screen.getByRole('navigation');
    expect(ul).toBeInTheDocument();
    const buttons = await within(ul).findAllByRole('button');
    expect(buttons).toHaveLength(sideMenuItems.length);
  });

  it('Renders side menu (mobile)', async () => {
    useIsMobileSpy.mockReturnValue(true);
    render(<SideMenu menuItems={sideMenuItems} />);
    const ul = screen.getByRole('navigation');
    expect(ul).toBeInTheDocument();
    const menuButtons = await within(ul).findAllByRole('button');
    expect(menuButtons).toHaveLength(1);
    await waitFor(() => {
      fireEvent.click(menuButtons[0]);
    });
    const drawer = screen.queryByRole('presentation');
    expect(drawer).toBeInTheDocument();
    const buttons = await within(drawer!).findAllByRole('button');
    expect(buttons).toHaveLength(sideMenuItems.length);
  });
});
