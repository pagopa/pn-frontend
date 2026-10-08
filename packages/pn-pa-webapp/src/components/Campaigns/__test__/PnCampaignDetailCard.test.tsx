import { vi } from 'vitest';

import { useMediaQuery } from '@mui/material';

import { render, screen } from '../../../__test__/test-utils';
import PnCampaignDetailCard from '../PnCampaignDetailCard';

vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material')>();

  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

const mockedUseMediaQuery = vi.mocked(useMediaQuery);

describe('PnCampaignDetailCard', () => {
  it('renders campaign ID before service name on mobile', () => {
    mockedUseMediaQuery.mockReturnValue(true);

    render(
      <PnCampaignDetailCard
        creationDate="2026-10-08T10:00:00Z"
        campaignId="CAMPAIGN-123"
        serviceName="Test Service"
        channels="EMAIL"
      />
    );

    const campaignId = screen.getByText('CAMPAIGN-123');
    const serviceName = screen.getByText('Test Service');

    expect(
      campaignId.compareDocumentPosition(serviceName) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('renders service name before campaign ID on desktop', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    render(
      <PnCampaignDetailCard
        creationDate="2026-10-08T10:00:00Z"
        campaignId="CAMPAIGN-123"
        serviceName="Test Service"
        channels="EMAIL"
      />
    );

    const campaignId = screen.getByText('CAMPAIGN-123');
    const serviceName = screen.getByText('Test Service');

    expect(
      serviceName.compareDocumentPosition(campaignId) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});
