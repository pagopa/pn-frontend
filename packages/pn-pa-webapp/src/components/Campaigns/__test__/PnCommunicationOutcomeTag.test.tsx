import { render, screen } from '../../../__test__/test-utils';
import PnCommunicationOutcomeTag from '../PnCommunicationOutcomeTag';

describe('PnCommunicationOutcomeTag', () => {
  it('renders viewed outcome', () => {
    render(<PnCommunicationOutcomeTag outcomes={{ viewed: true, delivered: false }} />);

    expect(screen.getByText('detail.communications.outcomes.viewed')).toBeInTheDocument();
    expect(screen.getByTestId('DraftsOutlinedIcon')).toBeInTheDocument();
  });

  it('renders viewed outcome when communication is also delivered', () => {
    render(<PnCommunicationOutcomeTag outcomes={{ viewed: true, delivered: true }} />);

    expect(screen.getByText('detail.communications.outcomes.viewed')).toBeInTheDocument();
    expect(screen.getByTestId('DraftsOutlinedIcon')).toBeInTheDocument();
    expect(screen.queryByText('detail.communications.outcomes.delivered')).not.toBeInTheDocument();
    expect(screen.queryByTestId('MarkEmailReadOutlinedIcon')).not.toBeInTheDocument();
  });

  it('renders delivered outcome', () => {
    render(<PnCommunicationOutcomeTag outcomes={{ viewed: false, delivered: true }} />);

    expect(screen.getByText('detail.communications.outcomes.delivered')).toBeInTheDocument();
    expect(screen.getByTestId('MarkEmailReadOutlinedIcon')).toBeInTheDocument();
  });

  it('renders not available outcome when communication is neither viewed nor delivered', () => {
    render(<PnCommunicationOutcomeTag outcomes={{ viewed: false, delivered: false }} />);

    expect(screen.getByText('-')).toBeInTheDocument();
    expect(
      screen.getByLabelText('detail.communications.outcomes.not-available')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('DraftsOutlinedIcon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('MarkEmailReadOutlinedIcon')).not.toBeInTheDocument();
  });

  it('renders not available outcome when outcomes are missing', () => {
    render(<PnCommunicationOutcomeTag />);

    expect(screen.getByText('-')).toBeInTheDocument();
    expect(
      screen.getByLabelText('detail.communications.outcomes.not-available')
    ).toBeInTheDocument();
  });
});
