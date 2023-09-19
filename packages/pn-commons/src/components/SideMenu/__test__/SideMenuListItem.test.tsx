import React from 'react';

import { RenderResult, fireEvent, render, waitFor } from '../../../test-utils';
import SideMenuListItem from '../SideMenuListItem';
import { sideMenuItems } from './test-utils';

const handleLinkClick = jest.fn();

describe('SideMenuListItem', () => {
  let result: RenderResult | undefined;

  beforeEach(() => {
    result = render(
      <SideMenuListItem
        item={sideMenuItems[0]}
        handleLinkClick={handleLinkClick}
        onSelect={() => {}}
      />
    );
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
  });

  it('Renders side menu list item', () => {
    const svg = result?.container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    const span = result?.container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent(sideMenuItems[0].label);
  });

  it('Clicks side menu list item', async () => {
    const link = result!.getByRole('button');
    await waitFor(() => {
      fireEvent.click(link!);
    });
    expect(handleLinkClick).toBeCalledTimes(1);
    expect(handleLinkClick).toBeCalledWith(sideMenuItems[0]);
  });
});
