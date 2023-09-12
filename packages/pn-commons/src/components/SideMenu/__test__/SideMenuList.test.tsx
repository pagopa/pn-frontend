import React from 'react';

import { RenderResult, fireEvent, screen, waitFor, within } from '@testing-library/react';

import { act, render } from '../../../test-utils';
import { SideMenuItem } from '../../../types';
import SideMenuList from '../SideMenuList';
import { sideMenuItems } from './test-utils';

async function testMenuItem(
  container: HTMLElement,
  expectedLength: number,
  menuItems: Array<SideMenuItem>
) {
  expect(container).toBeInTheDocument();
  const buttons = await within(container).findAllByRole('button');
  expect(buttons).toHaveLength(expectedLength);
  buttons.forEach((button, i) => {
    const item = button.querySelector('span');
    expect(item).toHaveTextContent(menuItems[i].label);
  });
}

const handleLinkClick = jest.fn();

describe('SideMenuList', () => {
  let result: RenderResult | undefined;
  beforeEach(async () => {
    await act(async () => {
      result = render(
        <SideMenuList
          menuItems={sideMenuItems}
          handleLinkClick={handleLinkClick}
          selectedItem={{
            index: 0,
            label: sideMenuItems[0].label,
            route: sideMenuItems[0].route!,
          }}
        />
      );
    });
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
  });

  it('Render side menu list', async () => {
    const ul = result?.getByRole('navigation');
    await testMenuItem(ul!, sideMenuItems.length, sideMenuItems);
  });

  // This test failed occassionally when executed in a developer' locale environment.
  // I guess that such failed runs were due to this passage in the code
  //     fireEvent.click(buttons[2]);
  //     await waitFor(() => {
  //       expect(collapsedMenu).not.toBeInTheDocument();
  //     });
  // In fact, the click dispatches immediately, what should be waited for is the re-rendering of the component.
  // Based on some examples found in
  //   https://snyk.io/advisor/npm-package/react-testing-library/functions/react-testing-library.fireEvent.change
  // I changed this part into
  //     fireEvent.click(buttons[2]);
  //     await waitFor(() => {
  //       expect(collapsedMenu).not.toBeInTheDocument();
  //     });
  // In order to verify that the latter ("new") implementation is indeed better than the former ("old") one,
  // I launched a loop of 100 run executions for each version, obtaining the following result
  //   - old implementation: 92 green, 8 red.
  //   - new implementation: 100 green, 0 red.
  // This was verified in the context of PN-2712.
  // --------------------------------------
  // Carlos Lombardi, 2022.12.14
  // --------------------------------------
  it('Open and close sub menu', async () => {
    const ul = result?.getByRole('navigation');
    const buttons = within(ul!).getAllByRole('button');
    fireEvent.click(buttons[1]);
    let collapsedMenu = within(ul!).getByTestId(`collapse-${sideMenuItems[1].label}`);
    await testMenuItem(
      collapsedMenu,
      sideMenuItems[1].children!.length,
      sideMenuItems[1].children!
    );
    fireEvent.click(buttons[2]);
    await waitFor(() => {
      expect(collapsedMenu).not.toBeInTheDocument();
    });
    collapsedMenu = await within(ul!).getByTestId(`collapse-${sideMenuItems[2].label}`);
    await testMenuItem(
      collapsedMenu,
      sideMenuItems[2].children!.length,
      sideMenuItems[2].children!
    );
  });
});
