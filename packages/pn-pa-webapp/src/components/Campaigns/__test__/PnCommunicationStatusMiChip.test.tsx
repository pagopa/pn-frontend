import { InformalNotificationStatus } from '@pagopa-pn/pn-commons';

import { render, screen, theme } from '../../../__test__/test-utils';
import PnCommunicationStatusMIChip from '../PnCommunicationStatusMiChip';

describe('PnCommunicationStatusMIChip', () => {
  it.each([
    {
      status: InformalNotificationStatus.ACCEPTED,
      label: 'detail.communications.statuses.ready',
      backgroundColor: theme.colors.blue[50],
    },
    {
      status: InformalNotificationStatus.PROCESSING,
      label: 'detail.communications.statuses.processing',
      backgroundColor: theme.colors.info[100],
    },
    {
      status: InformalNotificationStatus.COMPLETED_REACHED,
      label: 'detail.communications.statuses.success',
      backgroundColor: theme.colors.turquoise[50],
    },
    {
      status: InformalNotificationStatus.COMPLETED_UNREACHED,
      label: 'detail.communications.statuses.success',
      backgroundColor: theme.colors.turquoise[50],
    },
    {
      status: InformalNotificationStatus.UNDELIVERABLE,
      label: 'detail.communications.statuses.failed',
      backgroundColor: theme.colors.error[100],
    },
    {
      status: InformalNotificationStatus.REFUSED,
      label: 'detail.communications.statuses.refused',
      backgroundColor: theme.colors.error[100],
    },
  ])('renders $status status', ({ status, label, backgroundColor }) => {
    render(<PnCommunicationStatusMIChip status={status} />);

    const chip = screen.getByText(label).closest('.MuiChip-root');

    expect(chip).toBeInTheDocument();
    expect(chip).toHaveStyle({ backgroundColor });
  });

  it('renders placeholder for a status without mapping', () => {
    render(<PnCommunicationStatusMIChip status={InformalNotificationStatus.IN_VALIDATION} />);

    const chip = screen.getByText('-').closest('.MuiChip-root');

    expect(chip).toBeInTheDocument();
    expect(chip).toHaveStyle({ backgroundColor: theme.colors.blue[50] });
  });

  it('renders placeholder when status is missing', () => {
    render(<PnCommunicationStatusMIChip />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
