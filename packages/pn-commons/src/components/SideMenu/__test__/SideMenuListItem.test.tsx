import React from 'react';

import { sideMenuItems } from '../../../__mocks__/SideMenu.mock';
import { fireEvent, getById, queryById, render, waitFor, within } from '../../../test-utils';
import SideMenuListItem from '../SideMenuListItem';

const handleLinkClick = jest.fn();
const handleOnSelect = jest.fn();
const mockOpenFn = jest.fn();

describe('SideMenuListItem', () => {
  const original = window.open;

  beforeAll(() => {
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll((): void => {
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('renders component', () => {
    const { getByRole } = render(
      <SideMenuListItem
        item={sideMenuItems[0]}
        handleLinkClick={handleLinkClick}
        onSelect={handleOnSelect}
      />
    );
    const link = getByRole('button');
    const svg = link.querySelector('svg');
    expect(svg).toBeInTheDocument();
    const span = link.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent(sideMenuItems[0].label);
    const badge = queryById(link, `sideMenuItem-${sideMenuItems[0].label}-badge`);
    expect(badge).not.toBeInTheDocument();
  });

  it('clicks side menu list item', async () => {
    const { getByRole } = render(
      <SideMenuListItem
        item={sideMenuItems[0]}
        handleLinkClick={handleLinkClick}
        onSelect={handleOnSelect}
      />
    );
    const link = getByRole('button');
    fireEvent.click(link!);
    await waitFor(() => {
      expect(handleLinkClick).toBeCalledTimes(1);
      expect(handleLinkClick).toBeCalledWith(sideMenuItems[0]);
      expect(handleOnSelect).toBeCalledTimes(1);
    });
  });

  it('renders component - outside link', async () => {
    const { getByRole } = render(
      <SideMenuListItem
        item={sideMenuItems[0]}
        handleLinkClick={handleLinkClick}
        onSelect={handleOnSelect}
        goOutside
      />
    );
    const link = getByRole('button');
    fireEvent.click(link!);
    await waitFor(() => {
      expect(handleLinkClick).toBeCalledTimes(0);
      expect(handleOnSelect).toBeCalledTimes(1);
      expect(mockOpenFn).toBeCalledTimes(1);
      expect(mockOpenFn).toBeCalledWith(sideMenuItems[0].route);
    });
  });

  it('renders link with badge', () => {
    const { getByRole } = render(
      <SideMenuListItem
        item={{ ...sideMenuItems[0], dotBadge: true }}
        handleLinkClick={handleLinkClick}
        onSelect={handleOnSelect}
      />
    );
    const link = getByRole('button');
    const badge = getById(link, `sideMenuItem-${sideMenuItems[0].label}-badge`);
    expect(badge).toBeInTheDocument();
  });

  it('renders link with notification badge', () => {
    const { getByRole } = render(
      <SideMenuListItem
        item={{ ...sideMenuItems[0], rightBadgeNotification: 10 }}
        handleLinkClick={handleLinkClick}
        onSelect={handleOnSelect}
      />
    );
    const link = getByRole('button');
    const badge = within(link).getByTestId('notifications');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('10');
  });
});
