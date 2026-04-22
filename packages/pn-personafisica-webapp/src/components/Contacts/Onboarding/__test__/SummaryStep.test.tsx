import { render } from '../../../../__test__/test-utils';
import { IOAllowedValues } from '../../../../models/contacts';
import SummaryStep from '../SummaryStep';

describe('SummaryStep', () => {
  const labelPrefix = 'onboarding.digital-domicile.summary';
  const mockEmail = 'test@mock.pagopa.it';
  const mockPec = 'test@pec.mock.pagopa.it';

  it('renders the SEND summary with email, IO and info alert', () => {
    const { getByText, getByTestId } = render(
      <SummaryStep mode="send" email={mockEmail} io={IOAllowedValues.ENABLED} />
    );

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.legal-title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.courtesy-title`)).toBeInTheDocument();

    expect(getByText(`${labelPrefix}.ddom-label`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.send-badge`)).toBeInTheDocument();

    expect(getByText(`${labelPrefix}.io-label`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.io-value`)).toBeInTheDocument();

    expect(getByText(`${labelPrefix}.email-label`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();

    expect(getByTestId('onboardingDDomAlert')).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.info-box`)).toBeInTheDocument();
  });

  it('renders the PEC summary with PEC value and without disclaimer links', () => {
    const { getByText, queryByTestId } = render(
      <SummaryStep mode="pec" pec={mockPec} email={mockEmail} io={IOAllowedValues.ENABLED} />
    );

    expect(getByText(`${labelPrefix}.pec-badge`)).toBeInTheDocument();
    expect(getByText(mockPec)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.io-value`)).toBeInTheDocument();

    expect(queryByTestId('privacy-link')).not.toBeInTheDocument();
    expect(queryByTestId('tos-link')).not.toBeInTheDocument();
  });

  it('does not render the courtesy section when neither email nor IO is available', () => {
    const { queryByText } = render(<SummaryStep mode="send" />);

    expect(queryByText(`${labelPrefix}.courtesy-title`)).not.toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.email-label`)).not.toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.io-label`)).not.toBeInTheDocument();
  });

  it('renders only the available courtesy contact rows', () => {
    const { getByText, queryByText, rerender } = render(
      <SummaryStep mode="send" email={mockEmail} />
    );

    expect(getByText(mockEmail)).toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.io-label`)).not.toBeInTheDocument();

    rerender(<SummaryStep mode="send" io={IOAllowedValues.ENABLED} />);

    expect(getByText(`${labelPrefix}.io-label`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.io-value`)).toBeInTheDocument();
    expect(queryByText(mockEmail)).not.toBeInTheDocument();
  });
});
