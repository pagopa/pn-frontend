import { vi } from 'vitest';

import { EventNotificationTypes, EventPaymentRecipientType } from '../../../models';
import { act, createMatchMedia, fireEvent, render, screen, within } from '../../../test-utils';
import PnSenderContacts from '../PnSenderContacts';

const phone = '0123456789';
const site = 'www.ente-test.it';
const email = 'info@ente-test.it';
const pec = 'ente-test@pec.it';

describe('PnSenderContacts Component', () => {
  const originalMatchMedia = window.matchMedia;
  const original = window.navigator;
  const handleTrackEventFn = vi.fn();

  beforeAll(() => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  beforeEach(() => {
    window.matchMedia = createMatchMedia(1920);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'navigator', { value: original });
  });

  it('renders nothing if no contact is provided', () => {
    const { container } = render(<PnSenderContacts />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders all the contacts in the expected order', () => {
    const { container, getByRole, getAllByTestId } = render(
      <PnSenderContacts phone={phone} site={site} email={email} pec={pec} />
    );

    expect(getByRole('heading', { level: 2 })).toHaveTextContent('detail.contact_sender.title');

    const contacts = getAllByTestId(/^sender-contact-/);
    expect(contacts.map((contact) => contact.getAttribute('data-testid'))).toEqual([
      'sender-contact-website',
      'sender-contact-phone',
      'sender-contact-email',
      'sender-contact-pec',
    ]);

    expect(contacts[0]).toHaveTextContent('detail.contact_sender.website');
    expect(getByRole('link', { name: site })).toHaveAttribute('href', `https://${site}`);
    expect(contacts[1]).toHaveTextContent('detail.contact_sender.phone');
    expect(contacts[1]).toHaveTextContent(phone);
    expect(contacts[2]).toHaveTextContent('detail.contact_sender.email');
    expect(contacts[2]).toHaveTextContent(email);
    expect(contacts[3]).toHaveTextContent('detail.contact_sender.pec');
    expect(contacts[3]).toHaveTextContent(pec);
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(3);
  });

  it('renders only the phone contact', () => {
    const { container, queryByRole } = render(<PnSenderContacts phone={phone} />);

    expect(container).toHaveTextContent(phone);
    expect(container).not.toHaveTextContent('detail.contact_sender.website');
    expect(container).not.toHaveTextContent('detail.contact_sender.email');
    expect(container).not.toHaveTextContent('detail.contact_sender.pec');
    expect(queryByRole('link')).not.toBeInTheDocument();
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(0);
  });

  it('renders only the site contact, keeping the protocol if present', () => {
    const { container, getByRole } = render(<PnSenderContacts site="http://www.ente-test.it" />);

    expect(container).not.toHaveTextContent('detail.contact_sender.phone');
    expect(getByRole('link', { name: 'http://www.ente-test.it' })).toHaveAttribute(
      'href',
      'http://www.ente-test.it'
    );
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(0);
  });

  it.each([
    { type: 'email', value: email, props: { email } },
    { type: 'pec', value: pec, props: { pec } },
  ])('renders only the $type contact and copies it', async ({ type, value, props }) => {
    const { container, getByTestId } = render(<PnSenderContacts {...props} />);

    expect(container).toHaveTextContent(`detail.contact_sender.${type}`);
    expect(container).toHaveTextContent(value);
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(0);

    const copyButton = within(getByTestId(`sender-contact-${type}`)).getByRole('button', {
      name: `detail.contact_sender.copy_${type}`,
    });
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(value);
    expect(copyButton).toHaveAccessibleName(`detail.contact_sender.copied_${type}`);
  });

  it('keeps email and pec copyable on mobile', () => {
    window.matchMedia = createMatchMedia(400);
    const { getByRole, queryByRole } = render(<PnSenderContacts email={email} pec={pec} />);

    expect(queryByRole('link')).not.toBeInTheDocument();
    expect(getByRole('button', { name: 'detail.contact_sender.copy_email' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'detail.contact_sender.copy_pec' })).toBeInTheDocument();
  });

  it('tracks the click on the site', () => {
    render(<PnSenderContacts site={site} handleTrackEventFn={handleTrackEventFn} />);

    fireEvent.click(screen.getByRole('link', { name: site }));

    expect(handleTrackEventFn).toHaveBeenCalledTimes(1);
    expect(handleTrackEventFn).toHaveBeenCalledWith(
      EventPaymentRecipientType.SEND_TAP_EXTERNAL_LINK,
      {
        link: `https://${site}`,
        notification_type: EventNotificationTypes.INFORMAL,
      }
    );
  });

  it('renders the phone as a link on mobile and tracks the click', () => {
    window.matchMedia = createMatchMedia(400);
    render(<PnSenderContacts phone={phone} handleTrackEventFn={handleTrackEventFn} />);

    const phoneLink = screen.getByRole('link', { name: phone });
    expect(phoneLink).toHaveAttribute('href', `tel:${phone}`);
    expect(
      screen.queryByRole('button', { name: 'detail.contact_sender.copy_phone' })
    ).not.toBeInTheDocument();

    fireEvent.click(phoneLink);

    expect(handleTrackEventFn).toHaveBeenCalledWith(
      EventPaymentRecipientType.SEND_TAP_EXTERNAL_LINK,
      {
        link: `tel:${phone}`,
        notification_type: EventNotificationTypes.INFORMAL,
      }
    );
  });
});
