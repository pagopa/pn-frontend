import { describe, expect, it } from 'vitest';

import { render, screen } from '../../../../__test__/test-utils';
import { IOAllowedValues } from '../../../../models/contacts';
import { PRIVACY_POLICY, TERMS_OF_SERVICE_SERCQ_SEND } from '../../../../navigation/routes.const';
import SummaryStep from '../SummaryStep';

describe('SummaryStep', () => {
  const labelPrefix = 'onboarding.digital-domicile.summary';
  const mockEmail = 'test@mock.pagopa.it';
  const mockPec = 'test@pec.mock.pagopa.it';

  it('renders the SEND summary with email, IO, alert and disclaimer links', () => {
    render(<SummaryStep mode="send" email={mockEmail} io={IOAllowedValues.ENABLED} />);

    expect(screen.getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(screen.getByText(`${labelPrefix}.legal-title`)).toBeInTheDocument();
    expect(screen.getByText(`${labelPrefix}.courtesy-title`)).toBeInTheDocument();

    expect(screen.getByText(`${labelPrefix}.ddom-label`)).toBeInTheDocument();
    expect(screen.getByText(`${labelPrefix}.send-badge`)).toBeInTheDocument();

    expect(screen.getByText(`${labelPrefix}.io-label`)).toBeInTheDocument();
    expect(screen.getByText(`${labelPrefix}.io-value`)).toBeInTheDocument();

    expect(screen.getByText(`${labelPrefix}.email-label`)).toBeInTheDocument();
    expect(screen.getByText(mockEmail)).toBeInTheDocument();

    expect(screen.getByTestId('onboardingDDomAlert')).toBeInTheDocument();
    expect(screen.getByText(`${labelPrefix}.info-box`)).toBeInTheDocument();

    expect(screen.getByTestId('privacy-link')).toHaveAttribute('href', PRIVACY_POLICY);
    expect(screen.getByTestId('tos-link')).toHaveAttribute('href', TERMS_OF_SERVICE_SERCQ_SEND);
  });

  it('renders the PEC summary with PEC value and without disclaimer links', () => {
    render(<SummaryStep mode="pec" pec={mockPec} email={mockEmail} io={IOAllowedValues.ENABLED} />);

    expect(screen.getByText(`${labelPrefix}.pec-badge`)).toBeInTheDocument();
    expect(screen.getByText(mockPec)).toBeInTheDocument();
    expect(screen.getByText(mockEmail)).toBeInTheDocument();
    expect(screen.getByText(`${labelPrefix}.io-value`)).toBeInTheDocument();

    expect(screen.queryByTestId('privacy-link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tos-link')).not.toBeInTheDocument();
  });

  it('does not render the courtesy section when neither email nor IO is available', () => {
    render(<SummaryStep mode="send" />);

    expect(screen.queryByText(`${labelPrefix}.courtesy-title`)).not.toBeInTheDocument();
    expect(screen.queryByText(`${labelPrefix}.email-label`)).not.toBeInTheDocument();
    expect(screen.queryByText(`${labelPrefix}.io-label`)).not.toBeInTheDocument();
  });

  it('renders only the available courtesy contact rows', () => {
    const { rerender } = render(<SummaryStep mode="send" email={mockEmail} />);

    expect(screen.getByText(mockEmail)).toBeInTheDocument();
    expect(screen.queryByText(`${labelPrefix}.io-label`)).not.toBeInTheDocument();

    rerender(<SummaryStep mode="send" io={IOAllowedValues.ENABLED} />);

    expect(screen.getByText(`${labelPrefix}.io-label`)).toBeInTheDocument();
    expect(screen.getByText(`${labelPrefix}.io-value`)).toBeInTheDocument();
    expect(screen.queryByText(mockEmail)).not.toBeInTheDocument();
  });
});
