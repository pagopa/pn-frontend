import { render } from '../../../__test__/test-utils';
import { PRIVACY_POLICY, TERMS_OF_SERVICE_SERCQ_SEND } from '../../../navigation/routes.const';
import SercqSendDisclaimer from '../SercqSendDisclaimer';

describe('SercqSendDisclaimer', () => {
  it('renders the disclaimer with the provided i18nKey', () => {
    const { getByTestId } = render(
      <SercqSendDisclaimer i18nKey="special-contacts.sercq-disclaimer" />
    );

    const disclaimer = getByTestId('sercq-send-disclaimer');
    expect(disclaimer).toBeInTheDocument();
    expect(disclaimer).toHaveTextContent('special-contacts.sercq-disclaimer');
  });

  it('renders the privacy policy and terms of service links', () => {
    const { getByTestId } = render(
      <SercqSendDisclaimer i18nKey="special-contacts.sercq-disclaimer" />
    );

    const privacyLink = getByTestId('privacy-link');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', PRIVACY_POLICY);
    expect(privacyLink).toHaveAttribute('target', '_blank');
    expect(privacyLink).toHaveAttribute('rel', 'noopener');

    const tosLink = getByTestId('tos-link');
    expect(tosLink).toBeInTheDocument();
    expect(tosLink).toHaveAttribute('href', TERMS_OF_SERVICE_SERCQ_SEND);
    expect(tosLink).toHaveAttribute('target', '_blank');
    expect(tosLink).toHaveAttribute('rel', 'noopener');
  });
});
