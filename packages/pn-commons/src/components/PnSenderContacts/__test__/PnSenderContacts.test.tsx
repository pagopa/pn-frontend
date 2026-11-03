import { vi } from 'vitest';

import { EventNotificationTypes, EventPaymentRecipientType } from '../../../models';
import { createMatchMedia, fireEvent, render, screen } from '../../../test-utils';
import PnSenderContacts from '../PnSenderContacts';

const phone = '0123456789';
const site = 'www.ente-test.it';

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

  it('renders phone and site contacts', () => {
    const { container, getByRole } = render(<PnSenderContacts phone={phone} site={site} />);

    expect(getByRole('heading', { level: 2 })).toHaveTextContent('detail.contact_sender.title');
    expect(container).toHaveTextContent('detail.contact_sender.phone');
    expect(container).toHaveTextContent(phone);
    expect(container).toHaveTextContent('detail.contact_sender.website');
    expect(getByRole('link', { name: site })).toHaveAttribute('href', `https://${site}`);
    expect(container.querySelectorAll('hr')).toHaveLength(1);
  });

  it('renders only the phone contact', () => {
    const { container, queryByRole } = render(<PnSenderContacts phone={phone} />);

    expect(container).toHaveTextContent(phone);
    expect(container).not.toHaveTextContent('detail.contact_sender.website');
    expect(queryByRole('link')).not.toBeInTheDocument();
    expect(container.querySelectorAll('hr')).toHaveLength(0);
  });

  it('renders only the site contact, keeping the protocol if present', () => {
    const { container, getByRole } = render(<PnSenderContacts site="http://www.ente-test.it" />);

    expect(container).not.toHaveTextContent('detail.contact_sender.phone');
    expect(getByRole('link', { name: 'http://www.ente-test.it' })).toHaveAttribute(
      'href',
      'http://www.ente-test.it'
    );
    expect(container.querySelectorAll('hr')).toHaveLength(0);
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
