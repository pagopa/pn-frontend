import { vi } from 'vitest';

import { Configuration } from '@pagopa-pn/pn-commons';

import { fireEvent, render } from '../../../__test__/test-utils';
import { LoginConfiguration } from '../../../services/configuration.service';
import LoginButtons from '../LoginButtons';

describe('LoginButtons', () => {
  let ONE_IDENTITY_CIE_ENTITY_ID: string;
  const handleCieClick = vi.fn();
  const handleSpidClick = vi.fn();

  beforeAll(() => {
    ONE_IDENTITY_CIE_ENTITY_ID = Configuration.get<LoginConfiguration>().ONE_IDENTITY_CIE_ENTITY_ID;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    authorizingEntityId: null,
    handleCieClick,
    handleSpidClick,
  };

  it('renders SPID and CIE buttons', () => {
    const { container } = render(<LoginButtons {...defaultProps} />);
    expect(container.querySelector('#spidButton')).toBeInTheDocument();
    expect(container.querySelector('#cieButton')).toBeInTheDocument();
  });

  it('calls handleSpidClick when SPID button is clicked', () => {
    const { container } = render(<LoginButtons {...defaultProps} />);
    fireEvent.click(container.querySelector('#spidButton')!);
    expect(handleSpidClick).toHaveBeenCalledTimes(1);
  });

  it('calls handleCieClick when CIE button is clicked', () => {
    const { container } = render(<LoginButtons {...defaultProps} />);
    fireEvent.click(container.querySelector('#cieButton')!);
    expect(handleCieClick).toHaveBeenCalledTimes(1);
  });

  it('disable CIE button when authorizingEntityId is set', () => {
    const { container } = render(
      <LoginButtons {...defaultProps} authorizingEntityId={ONE_IDENTITY_CIE_ENTITY_ID} />
    );
    expect(container.querySelector('#cieButton')).toBeDisabled();
  });

  it('does not disable CIE button when authorizingEntityId is null', () => {
    const { container } = render(<LoginButtons {...defaultProps} />);
    expect(container.querySelector('#cieButton')).not.toBeDisabled();
  });

  it('shows spinner on CIE button when authorizingEntityId matches CIE entity id', () => {
    const { container } = render(
      <LoginButtons {...defaultProps} authorizingEntityId={ONE_IDENTITY_CIE_ENTITY_ID} />
    );
    expect(container.querySelector('[data-testid="cie-loader"]')).toBeInTheDocument();
  });

  it('does not show spinner on CIE button when authorizingEntityId is null', () => {
    const { container } = render(<LoginButtons {...defaultProps} />);
    expect(container.querySelector('[data-testid="cie-loader"]')).not.toBeInTheDocument();
  });

  it('does not show spinner on CIE button when authorizingEntityId is a SPID entity id', () => {
    const { container } = render(
      <LoginButtons {...defaultProps} authorizingEntityId="https://some-spid-idp.it" />
    );
    expect(container.querySelector('[data-testid="cie-loader"]')).not.toBeInTheDocument();
  });
});
