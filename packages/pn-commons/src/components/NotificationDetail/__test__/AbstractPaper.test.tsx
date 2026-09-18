import { render } from '../../../test-utils';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import AbstractPaper from '../AbstractPaper';

const defaultProps = {
  title: 'Oggetto della notifica di prova',
  senderPaId: 'sender-pa-id',
  senderDenomination: 'Ente di Test',
  iun: 'ABCD-EFGH-IJKL-202308-M-1',
  filedAt: '2023-08-01T10:00:00Z',
};

describe('AbstractPaper Component - disclaimer', () => {
  const informalDisclaimer = getLocalizedOrDefaultLabel(
    'notifications',
    'detail.informal-disclaimer'
  );
  const legalDisclaimer = getLocalizedOrDefaultLabel('notifications', 'detail.legal-disclaimer');

  it('shows the legal disclaimer for a legal notification (default)', () => {
    const { container } = render(<AbstractPaper {...defaultProps} />);
    expect(container).toHaveTextContent(legalDisclaimer);
    expect(container).not.toHaveTextContent(informalDisclaimer);
  });

  it('shows the informal disclaimer for an informal communication', () => {
    const { container } = render(
      <AbstractPaper {...defaultProps} isLegal={false} abstract="Testo informale di prova" />
    );
    expect(container).toHaveTextContent(informalDisclaimer);
    expect(container).not.toHaveTextContent(legalDisclaimer);
  });
});
