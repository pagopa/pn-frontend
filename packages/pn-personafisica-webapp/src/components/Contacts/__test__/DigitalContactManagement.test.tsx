import { vi } from 'vitest';

import { digitalAddresses, digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { AddressType } from '../../../models/contacts';
import * as routes from '../../../navigation/routes.const';
import DigitalContactManagement from '../DigitalContactManagement';

const lblPrefix = 'legal-contacts.digital-domicile-management';

describe('DigitalContactManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('render the component when PEC is enabled', () => {
    const { container } = render(<DigitalContactManagement />, {
      preloadedState: {
        contactsState: {
          digitalAddresses,
        },
      },
    });

    const pecValue = digitalAddresses.find(
      (addr) => addr.addressType === AddressType.LEGAL && addr.senderId === 'default'
    )!.value;

    expect(container).toHaveTextContent(`${lblPrefix}.title`);
    expect(container).toHaveTextContent(pecValue);

    expect(container).toHaveTextContent('status.active');
    expect(container).toHaveTextContent(`${lblPrefix}.choose-action`);

    expect(container).toHaveTextContent(`${lblPrefix}.transfer.title-pec`);
    expect(container).toHaveTextContent(`${lblPrefix}.transfer.content-pec`);
    expect(container).toHaveTextContent(`${lblPrefix}.transfer.action-pec`);

    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.title`);
    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.content`);
    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.action`);
    expect(container).toHaveTextContent('button.indietro');
  });

  it('render the component when SERCQ SEND is enabled', () => {
    const { container } = render(<DigitalContactManagement />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesSercq,
        },
      },
    });

    expect(container).toHaveTextContent(`${lblPrefix}.title`);
    expect(container).toHaveTextContent(`${lblPrefix}.sercq_send-active`);

    expect(container).toHaveTextContent('status.active');
    expect(container).toHaveTextContent(`${lblPrefix}.choose-action`);

    expect(container).toHaveTextContent(`${lblPrefix}.transfer.title-sercq_send`);
    expect(container).toHaveTextContent(`${lblPrefix}.transfer.content-sercq_send`);
    expect(container).toHaveTextContent(`${lblPrefix}.transfer.action-sercq_send`);

    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.title`);
    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.content`);
    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.action`);
    expect(container).toHaveTextContent('button.indietro');
  });

  it('render the digital domicile transfer wizard', () => {
    const { container, getByRole } = render(<DigitalContactManagement />, {
      preloadedState: {
        contactsState: {
          digitalAddresses,
        },
      },
    });

    const transferButton = getByRole('button', {
      name: `${lblPrefix}.transfer.action-pec`,
    });
    fireEvent.click(transferButton);
    expect(container).toHaveTextContent('legal-contacts.sercq-send-wizard.title-transfer');
  });

  it('should go back when clicking on the back button', () => {
    const { getByText, router } = render(<DigitalContactManagement />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesSercq,
        },
      },
      route: [routes.RECAPITI, routes.DIGITAL_DOMICILE_MANAGEMENT],
    });
    const backButton = getByText('button.indietro');
    expect(backButton).toBeInTheDocument();

    expect(router.state.location.pathname).toBe(routes.DIGITAL_DOMICILE_MANAGEMENT);

    fireEvent.click(backButton);
    expect(router.state.location.pathname).toBe(routes.RECAPITI);
    expect(router.state.historyAction).toBe('POP');
  });
});
