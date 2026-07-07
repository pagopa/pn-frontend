import { vi } from 'vitest';

import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';
import userEvent from '@testing-library/user-event';

import { fireEvent, render, waitFor, within } from '../../test-utils';
import PnInfoCard from '../PnInfoCard';

const mockBtnOneCbk = vi.fn();
const mockBtnTwoCbk = vi.fn();

const title = 'Mocked title';
const subTitle = 'Mocked subtitle';
const body = <div data-testid="body">Body</div>;

const actions = [
  {
    key: 'one',
    label: 'One',
    testId: 'btn-one',
    onClick: mockBtnOneCbk,
  },
  {
    key: 'two',
    label: 'Two',
    testId: 'btn-two',
    onClick: mockBtnTwoCbk,
  },
];

describe('PnInfoCard Component', () => {
  beforeEach(() => {
    globalThis.matchMedia = createMatchMedia(1280);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders component', async () => {
    // render component
    const { container, getByTestId } = render(
      <PnInfoCard title={title} subtitle={subTitle} actions={actions}>
        {body}
      </PnInfoCard>
    );
    const headerEl = getByTestId('PnInfoCardHeader');
    expect(headerEl).toBeInTheDocument();
    const titleEl = getByTestId('PnInfoCardTitle');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(title);
    expect(container).toHaveTextContent(subTitle);
    const bodyEl = getByTestId('body');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(/Body/i);

    const btnOne = getByTestId('btn-one');
    expect(btnOne).toBeInTheDocument();
    fireEvent.click(btnOne);
    expect(mockBtnOneCbk).toHaveBeenCalledTimes(1);
    const btnTwo = getByTestId('btn-two');
    expect(btnTwo).toBeInTheDocument();
    fireEvent.click(btnTwo);
    expect(mockBtnTwoCbk).toHaveBeenCalledTimes(1);
  });

  it('renders component - no actions', () => {
    // render component
    const { container, getByTestId, queryByTestId } = render(
      <PnInfoCard title={title} subtitle={subTitle}>
        {body}
      </PnInfoCard>
    );
    const headerEl = getByTestId('PnInfoCardHeader');
    expect(headerEl).toBeInTheDocument();
    const titleEl = getByTestId('PnInfoCardTitle');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(title);
    expect(container).toHaveTextContent(subTitle);
    const bodyEl = getByTestId('body');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(/Body/i);

    const btnOne = queryByTestId('btn-one');
    expect(btnOne).not.toBeInTheDocument();
    const btnTwo = queryByTestId('btn-two');
    expect(btnTwo).not.toBeInTheDocument();
  });

  it('renders an accessible accordion on mobile', async () => {
    globalThis.matchMedia = createMatchMedia(800);
    const user = userEvent.setup();

    const { getByRole, queryByRole, queryByTestId } = render(
      <PnInfoCard title={title} subtitle={subTitle} mobileCollapsible>
        {body}
      </PnInfoCard>
    );

    const heading = getByRole('heading', { level: 5 });
    const accordionButton = within(heading).getByRole('button', {
      name: new RegExp(title, 'i'),
    });

    const panelId = accordionButton.getAttribute('aria-controls');

    expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
    expect(panelId).toBeTruthy();

    expect(queryByTestId('PnInfoCardBody')).not.toBeInTheDocument();
    expect(queryByRole('region')).not.toBeInTheDocument();

    await user.click(accordionButton);

    await waitFor(() => {
      expect(accordionButton).toHaveAttribute('aria-expanded', 'true');
    });

    const panel = getByRole('region');

    expect(panel).toHaveAttribute('id', panelId);
    expect(panel).toHaveAttribute('aria-labelledby', accordionButton.id);
    expect(panel).toBeVisible();

    await user.click(accordionButton);

    await waitFor(() => {
      expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
      expect(queryByTestId('PnInfoCardBody')).not.toBeInTheDocument();
      expect(queryByRole('region')).not.toBeInTheDocument();
    });
  });

  it('activates mobile menu actions using the keyboard', async () => {
    globalThis.matchMedia = createMatchMedia(800);
    const user = userEvent.setup();

    const { getByTestId, queryByRole } = render(
      <PnInfoCard title={title} subtitle={subTitle} actions={actions}>
        {body}
      </PnInfoCard>
    );

    const menuButton = getByTestId('contextMenuButton');

    menuButton.focus();
    await user.keyboard('{Enter}');

    const firstAction = getByTestId('btn-one');

    expect(firstAction).toBeInTheDocument();

    firstAction.focus();
    await user.keyboard('{Enter}');

    expect(mockBtnOneCbk).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(queryByRole('menu')).not.toBeInTheDocument();
    });

    await user.click(menuButton);

    const secondAction = getByTestId('btn-two');

    secondAction.focus();
    await user.keyboard(' ');

    expect(mockBtnTwoCbk).toHaveBeenCalledTimes(1);
  });
});
