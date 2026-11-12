import { vi } from 'vitest';

import { NotificationDetailRecipient, RecipientType } from '../../../models';
import { createMatchMedia, fireEvent, render } from '../../../test-utils';
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

describe('AbstractPaper Component - details', () => {
  const details = [
    { label: 'Mittente', value: 'Ente di Test' },
    { label: 'Oggetto', value: 'Oggetto della comunicazione' },
  ];

  it('renders the details instead of the sender and iun section', () => {
    const { container, getByText, queryByText } = render(
      <AbstractPaper {...defaultProps} isSender isLegal={false} details={details} />
    );

    details.forEach((detail) => {
      expect(getByText(detail.label).parentElement).toHaveTextContent(detail.value);
    });
    expect(queryByText(getLocalizedOrDefaultLabel('common', 'iun'))).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(
      getLocalizedOrDefaultLabel('notifications', 'detail.informal-disclaimer')
    );
    expect(queryByText(getLocalizedOrDefaultLabel('notifications', 'go-to-detail'))).toBeNull();
  });

  it('calls onDetailsClick when the details button is clicked', () => {
    const onDetailsClick = vi.fn();
    const { getByRole } = render(
      <AbstractPaper
        {...defaultProps}
        isSender
        isLegal={false}
        details={details}
        onDetailsClick={onDetailsClick}
        detailsAriaLabel="Vedi i dettagli"
      />
    );

    fireEvent.click(getByRole('button', { name: 'Vedi i dettagli' }));

    expect(onDetailsClick).toHaveBeenCalledTimes(1);
  });
});

describe('AbstractPaper Component - layout', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('renders the informal message as abstract of an informal communication', () => {
    const { getByTestId } = render(
      <AbstractPaper {...defaultProps} isLegal={false} abstract="Testo informale di prova" />
    );

    expect(getByTestId('informalNotificationMessage')).toHaveTextContent(
      'Testo informale di prova'
    );
  });

  it('adds a divider between the sender and the iun on mobile', () => {
    window.matchMedia = createMatchMedia(1920);
    const { container, unmount } = render(<AbstractPaper {...defaultProps} isLegal={false} />);
    const desktopDividers = container.querySelectorAll('hr').length;
    unmount();

    window.matchMedia = createMatchMedia(400);
    const { container: mobileContainer } = render(
      <AbstractPaper {...defaultProps} isLegal={false} />
    );

    expect(mobileContainer.querySelectorAll('hr')).toHaveLength(desktopDividers + 1);
  });
});

describe('AbstractPaper Component - delegated recipient', () => {
  const recipient: NotificationDetailRecipient = {
    recipientType: RecipientType.PF,
    denomination: 'DESTINATARIO_FITTIZIO_001',
    taxId: 'CODICE_FISCALE_FITTIZIO_001',
  };

  const recipientLabel = getLocalizedOrDefaultLabel(
    'notifications',
    'detail.notification-detail-section.recipient'
  );

  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('shows the delegated recipient in the summary', () => {
    const { getByText } = render(
      <AbstractPaper {...defaultProps} isDelegate recipient={recipient} />
    );

    expect(getByText(recipientLabel)).toBeInTheDocument();
    expect(getByText(`${recipient.denomination} - ${recipient.taxId}`)).toBeInTheDocument();
  });

  it('does not show recipient details without a delegation', () => {
    const { queryByText } = render(<AbstractPaper {...defaultProps} recipient={recipient} />);

    expect(queryByText(recipientLabel)).not.toBeInTheDocument();
    expect(queryByText(`${recipient.denomination} - ${recipient.taxId}`)).not.toBeInTheDocument();
  });

  it('does not show the recipient block when recipient data is missing', () => {
    const { queryByText } = render(<AbstractPaper {...defaultProps} isDelegate />);

    expect(queryByText(recipientLabel)).not.toBeInTheDocument();
  });
});
