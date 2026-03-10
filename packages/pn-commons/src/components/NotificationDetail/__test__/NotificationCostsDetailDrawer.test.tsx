import { fireEvent, initLocalizationForTest, render, waitFor } from '../../../test-utils';
import NotificationCostsDetailDrawer from '../NotificationCostsDetailDrawer';

describe('NotificationCostsDetailDrawer component', () => {
  const costDetailsAssistanceLink = 'https://www.example.com/';

  beforeAll(() => {
    initLocalizationForTest();
  });

  it('should open the drawer when CTA button is clicked', () => {
    const { getByRole, getByTestId } = render(
      <NotificationCostsDetailDrawer
        costDetailsAssistanceLink={costDetailsAssistanceLink}
        handleTrackEventFn={() => {}}
      />
    );

    const ctaButton = getByRole('button', {
      name: 'notifiche - notification-alert.cta',
    });
    fireEvent.click(ctaButton);

    expect(getByTestId('cost-details-drawer')).toBeInTheDocument();
    expect(getByTestId('cost-details-drawer-title')).toBeInTheDocument();
  });

  it('should close the drawer when close button is clicked', async () => {
    const { getByRole, getByTestId, queryByTestId } = render(
      <NotificationCostsDetailDrawer
        costDetailsAssistanceLink={costDetailsAssistanceLink}
        handleTrackEventFn={() => {}}
      />
    );

    const ctaButton = getByRole('button', {
      name: 'notifiche - notification-alert.cta',
    });
    fireEvent.click(ctaButton);

    const closeButton = getByTestId('cost-details-drawer-close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(queryByTestId('cost-details-drawer')).not.toBeInTheDocument();
    });
  });

  it('should render the assistance link with correct href', () => {
    const { getByRole, getByTestId } = render(
      <NotificationCostsDetailDrawer
        costDetailsAssistanceLink={costDetailsAssistanceLink}
        handleTrackEventFn={() => {}}
      />
    );

    const ctaButton = getByRole('button', {
      name: 'notifiche - notification-alert.cta',
    });
    fireEvent.click(ctaButton);

    const faqLink = getByTestId('cost-details-drawer-assistance-link');
    expect(faqLink).toBeInTheDocument();
    expect(faqLink).toHaveAttribute('href', costDetailsAssistanceLink);
    expect(faqLink).toHaveAttribute('target', '_blank');
  });
});
