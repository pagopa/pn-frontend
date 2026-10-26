import { render, screen } from '../../../__test__/test-utils';
import PnCampaignCommunicationsLoading from '../PnCampaignCommunicationsLoading';

describe('PnCampaignCommunicationsLoading', () => {
  it('renders the table header', () => {
    render(<PnCampaignCommunicationsLoading />);

    expect(screen.getByTestId('campaignCommunicationsLoading')).toBeInTheDocument();
    expect(screen.getByText('detail.communications.tax-id')).toBeInTheDocument();
    expect(screen.getByText('detail.communications.iun')).toBeInTheDocument();
    expect(screen.getByText('detail.communications.status')).toBeInTheDocument();
    expect(screen.getByText('detail.communications.outcome')).toBeInTheDocument();
  });

  it('renders header columns in the right order', () => {
    render(<PnCampaignCommunicationsLoading />);

    const headerCells = screen
      .getByTestId('campaignCommunicationsLoading')
      .firstElementChild!.querySelectorAll('p');

    expect(Array.from(headerCells).map((cell) => cell.textContent)).toStrictEqual([
      'detail.communications.tax-id',
      'detail.communications.iun',
      'detail.communications.status',
      'detail.communications.outcome',
    ]);
  });

  it('renders five skeleton rows with four cells each', () => {
    render(<PnCampaignCommunicationsLoading />);

    const loading = screen.getByTestId('campaignCommunicationsLoading');

    expect(loading.children).toHaveLength(6);
    expect(loading.querySelectorAll('.MuiSkeleton-root')).toHaveLength(20);
  });
});
