import React from 'react';

import { RenderResult, fireEvent, waitFor, within } from '@testing-library/react';

import * as hooks from '../../../hooks/useIsMobile';
import { act, render } from '../../../test-utils';
import SideMenu from '../SideMenu';
import { sideMenuItems } from './test-utils';

const useIsMobileSpy = jest.spyOn(hooks, 'useIsMobile');

describe('SideMenu', () => {
  let result: RenderResult | undefined;

  afterEach(() => {
    result = undefined;
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
  });

  it('Renders side menu (no mobile)', async () => {
    useIsMobileSpy.mockReturnValue(false);

    await act(async () => {
      result = render(<SideMenu menuItems={sideMenuItems} />);
    });

    const ul = result?.getByRole('navigation');
    expect(ul).toBeInTheDocument();

    const buttons = within(ul!).getAllByRole('button');
    expect(buttons).toHaveLength(sideMenuItems.length);
  });

  it('Renders side menu (mobile)', async () => {
    useIsMobileSpy.mockReturnValue(true);

    await act(async () => {
      result = render(<SideMenu menuItems={sideMenuItems} />);
    });

    const ul = result?.getByRole('navigation');
    expect(ul).toBeInTheDocument();

    const menuButtons = within(ul!).getAllByRole('button');
    expect(menuButtons).toHaveLength(1);

    await waitFor(() => {
      fireEvent.click(menuButtons[0]);
    });

    const drawer = result?.getByRole('presentation');
    expect(drawer).toBeInTheDocument();

    const buttons = within(drawer!).getAllByRole('button');
    expect(buttons).toHaveLength(sideMenuItems.length);
  });
});
