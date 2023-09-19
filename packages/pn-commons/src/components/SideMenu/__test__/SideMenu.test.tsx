import React from 'react';

import {
  RenderResult,
  act,
  createMatchMedia,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../test-utils';
import SideMenu from '../SideMenu';
import { sideMenuItems } from './test-utils';

describe('SideMenu', () => {
  let result: RenderResult | undefined;
  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  afterEach(() => {
    result = undefined;
    window.matchMedia = original;
  });

  it('Renders side menu (no mobile)', async () => {
    await act(async () => {
      result = render(<SideMenu menuItems={sideMenuItems} />);
    });

    const ul = result?.getByRole('navigation');
    expect(ul).toBeInTheDocument();

    const buttons = within(ul!).getAllByRole('button');
    expect(buttons).toHaveLength(sideMenuItems.length);
  });

  it('Renders side menu (mobile)', async () => {
    window.matchMedia = createMatchMedia(800);

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
