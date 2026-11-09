import { render } from '../../../__test__/test-utils';
import PnCampaignDetailLoading from '../PnCampaignDetailLoading';

describe('PnCampaignDetailLoading', () => {
  it('renders title and description skeletons outside the detail card', () => {
    const { container } = render(<PnCampaignDetailLoading />);

    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    const detailCard = container.querySelector('.MuiPaper-root')!;

    expect(skeletons).toHaveLength(10);
    expect(detailCard).not.toContainElement(skeletons[0] as HTMLElement);
    expect(detailCard).not.toContainElement(skeletons[1] as HTMLElement);
  });

  it('renders the detail card skeletons', () => {
    const { container } = render(<PnCampaignDetailLoading />);

    const detailCard = container.querySelector('.MuiPaper-root')!;

    expect(detailCard.querySelectorAll('.MuiSkeleton-root')).toHaveLength(8);
    expect(detailCard.querySelectorAll('hr')).toHaveLength(2);
  });
});
