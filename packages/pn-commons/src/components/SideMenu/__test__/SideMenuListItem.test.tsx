import { vi } from 'vitest';

import { sideMenuItems } from '../../../__mocks__/SideMenu.mock';
import { fireEvent, getById, queryById, render, waitFor, within } from '../../../test-utils';
import SideMenuListItem from '../SideMenuListItem';

const handleLinkClick = vi.fn();
const handleOnSelect = vi.fn();
const mockOpenFn = vi.fn();

describe('SideMenuListItem', () => {
  beforeAll(() => {
    vi.stubGlobal('open', mockOpenFn);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  afterAll((): void => {
    vi.unstubAllGlobals();
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

  it('renders link with new notification dot', () => {
    const { getByRole } = render(
      <SideMenuListItem
        item={{ ...sideMenuItems[0], dotNotification: true }}
        handleLinkClick={handleLinkClick}
        onSelect={handleOnSelect}
      />
    );
    const link = getByRole('button');
    const dot = within(link).getByTestId('new-notification-badge');
    expect(dot).toBeInTheDocument();
  });

  it('does not render new notification dot when dotNotification is false', () => {
    const { getByRole } = render(
      <SideMenuListItem
        item={{ ...sideMenuItems[0], dotNotification: false }}
        handleLinkClick={handleLinkClick}
        onSelect={handleOnSelect}
      />
    );
    const link = getByRole('button');
    const dot = within(link).queryByTestId('new-notification-badge');
    expect(dot).not.toBeInTheDocument();
  });
});
