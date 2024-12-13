import { vi } from 'vitest';

import { createMatchMedia, queryByTestId } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, waitFor } from '../../test-utils';
import PnInfoCard from '../PnInfoCard';

const mockBtnOneCbk = vi.fn();
const mockBtnTwoCbk = vi.fn();

const header = 'Mocked header';
const title = 'Mocked title';
const subTitle = 'Mocked subtitle';
const body = <div data-testid="body">Body</div>;
const actions = [
  <button key="one" data-testid="btn-one" onClick={mockBtnOneCbk}>
    One
  </button>,
  <button key="two" data-testid="btn-two" onClick={mockBtnTwoCbk}>
    Two
  </button>,
];

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('PnInfoCard Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders component', async () => {
    // render component
    const { container, getByTestId, queryByTestId } = render(
      <PnInfoCard title={title} subtitle={subTitle} actions={actions}>
        {body}
      </PnInfoCard>
    );
    const titleEl = getByTestId('PnInfoCardTitle');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(title);
    expect(container).toHaveTextContent(subTitle);
    const bodyEl = getByTestId('body');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(/Body/i);
    const headerEl = queryByTestId('PnInfoCardHeader');
    expect(headerEl).not.toBeInTheDocument();

    const btnOne = getByTestId('btn-one');
    expect(btnOne).toBeInTheDocument();
    fireEvent.click(btnOne);
    await waitFor(() => {
      expect(mockBtnOneCbk).toHaveBeenCalledTimes(1);
    });
    const btnTwo = getByTestId('btn-two');
    expect(btnTwo).toBeInTheDocument();
    fireEvent.click(btnTwo);
    await waitFor(() => {
      expect(mockBtnTwoCbk).toHaveBeenCalledTimes(1);
    });
  });

  it('renders component - with header', () => {
    // render component
    const { container, getByTestId } = render(
      <PnInfoCard header={header} title={title} subtitle={subTitle}>
        {body}
      </PnInfoCard>
    );
    const titleEl = getByTestId('PnInfoCardTitle');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(title);
    expect(container).toHaveTextContent(subTitle);
    const bodyEl = getByTestId('body');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(/Body/i);
    const headerEl = getByTestId('PnInfoCardHeader');
    expect(headerEl).toBeInTheDocument();
  });

  it('renders component - mobile', async () => {
    window.matchMedia = createMatchMedia(800);
    const { container, getByTestId } = render(
      <PnInfoCard title={title} subtitle={subTitle}>
        {body}
      </PnInfoCard>
    );
    const titleEl = getByTestId('PnInfoCardTitle');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(title);
    expect(container).toHaveTextContent(subTitle);
    let bodyEl = queryByTestId(container, 'body');
    expect(bodyEl).not.toBeInTheDocument();
    const collapseIcon = getByTestId('KeyboardArrowDownOutlinedIcon');
    expect(collapseIcon).toBeInTheDocument();
    fireEvent.click(collapseIcon);
    await waitFor(() => expect(container).toHaveTextContent(subTitle));
    expect(collapseIcon).not.toBeInTheDocument();
    const expandIcon = getByTestId('KeyboardArrowUpOutlinedIcon');
    expect(expandIcon).toBeInTheDocument();
    bodyEl = getByTestId('body');
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl).toHaveTextContent(/Body/i);
  });

  it('renders component - mobile with actions', async () => {
    window.matchMedia = createMatchMedia(800);
    const { getByTestId } = render(
      <PnInfoCard title={title} subtitle={subTitle} actions={actions}>
        {body}
      </PnInfoCard>
    );

    const menuBtn = getByTestId('contextMenuButton');
    expect(menuBtn).toBeInTheDocument();
    fireEvent.click(menuBtn);

    await waitFor(() => {
      const btnOne = getByTestId('btn-one');
      expect(btnOne).toBeInTheDocument();
      fireEvent.click(btnOne);

      const btnTwo = getByTestId('btn-two');
      expect(btnTwo).toBeInTheDocument();
      fireEvent.click(btnTwo);
    });

    await waitFor(() => {
      expect(mockBtnOneCbk).toHaveBeenCalledTimes(1);
      expect(mockBtnTwoCbk).toHaveBeenCalledTimes(1);
    });
  });
});
