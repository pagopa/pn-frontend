import { vi } from 'vitest';

import { comunicationsList } from '../../../__mocks__/CampaignDetail.mock';
import { render, screen } from '../../../__test__/test-utils';
import PnCampaignCommunications from '../PnCampaignCommunications';

const mockViewport = (isMobile: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query) => ({
      matches: isMobile,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
};

const renderCommunications = () =>
  render(<PnCampaignCommunications campaignId="FattOrd" fetchCampaignCommunications={vi.fn()} />, {
    preloadedState: {
      campaignState: {
        campaigns: [],
        campaignDetail: {},
        communicationsCampaignId: 'FattOrd',
        campaignCommunications: comunicationsList,
        communicationFilters: {
          recipientId: '',
          iunMatch: '',
          status: [],
          outcome: '',
        },
        pagination: {
          nextPagesKey: [],
          size: 10,
          page: 0,
          moreResult: false,
        },
        communicationsPagination: {
          nextPagesKey: [],
          size: 10,
          page: 0,
          moreResult: false,
        },
      },
    },
  });

describe('PnCampaignCommunications', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders filter icon on mobile', () => {
    mockViewport(true);
    renderCommunications();

    expect(screen.getByTestId('FilterAltOutlinedIcon')).toBeInTheDocument();
  });

  it('renders IUN in bold on mobile', () => {
    mockViewport(true);
    renderCommunications();

    const iun = screen.getByText('XGPG-LXPA-YXRL-202308-M-A');

    expect(iun).toHaveStyle({ fontWeight: 600 });
  });

  it('renders the Open action on mobile', () => {
    mockViewport(true);
    renderCommunications();

    const openButtons = screen.getAllByRole('button', {
      name: 'button.open',
    });

    expect(openButtons).toHaveLength(comunicationsList.resultsPage?.length ?? 0);
  });

  it('renders the Open action on desktop', () => {
    mockViewport(false);
    renderCommunications();

    const openButtons = screen.getAllByRole('button', {
      name: 'button.open',
    });

    expect(openButtons).toHaveLength(comunicationsList.resultsPage?.length ?? 0);
  });
});
