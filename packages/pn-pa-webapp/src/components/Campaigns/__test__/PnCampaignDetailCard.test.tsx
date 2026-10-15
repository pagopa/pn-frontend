import { render, screen } from '../../../__test__/test-utils';
import PnCampaignDetailCard from '../PnCampaignDetailCard';

describe('PnCampaignDetailCard', () => {
  it('renders all campaign details', () => {
    render(
      <PnCampaignDetailCard
        creationDate="2026-10-08T10:00:00Z"
        campaignId="CAMPAIGN-123"
        serviceName="Test Service"
        channels="EMAIL"
      />
    );

    expect(screen.getByText('CAMPAIGN-123')).toBeInTheDocument();
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('EMAIL')).toBeInTheDocument();
  });

  it('renders campaign ID before service name in the DOM', () => {
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
});
