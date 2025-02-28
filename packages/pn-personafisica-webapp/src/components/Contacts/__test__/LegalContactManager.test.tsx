import { vi } from 'vitest';

import {
  digitalAddresses,
  digitalAddressesPecValidation,
  digitalAddressesSercq,
} from '../../../__mocks__/Contacts.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import LegalContactManager, { DigitalDomicileManagementAction } from '../LegalContactManager';

const mockSetAction = vi.fn();

const lblPrefix = 'legal-contacts.digital-domicile-management';

describe('LegalContactManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('render component when SERCQ SEND is enabled', () => {
    const { container, getByRole } = render(<LegalContactManager setAction={mockSetAction} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesSercq,
        },
      },
    });

    expect(container).toHaveTextContent('status.active');
    expect(container).toHaveTextContent(`${lblPrefix}.sercq_send-active`);
    expect(container).toHaveTextContent(`${lblPrefix}.choose-action`);
    expect(container).toHaveTextContent(`${lblPrefix}.transfer.title-sercq_send`);
    expect(container).toHaveTextContent(`${lblPrefix}.transfer.content-sercq_send`);
    const transferBtn = getByRole('button', {
      name: `${lblPrefix}.transfer.action-sercq_send`,
    });
    expect(transferBtn).toBeInTheDocument();

    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.title`);
    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.content`);
    const specialContactsBtn = getByRole('button', {
      name: `${lblPrefix}.special_contacts.action`,
    });
    expect(specialContactsBtn).toBeInTheDocument();

    fireEvent.click(transferBtn);
    expect(mockSetAction).toHaveBeenCalledTimes(1);
    expect(mockSetAction).toHaveBeenCalledWith(
      DigitalDomicileManagementAction.DIGITAL_DOMICILE_TRANSFER
    );
    fireEvent.click(specialContactsBtn);
    expect(mockSetAction).toHaveBeenCalledTimes(2);
    expect(mockSetAction).toHaveBeenCalledWith(DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT);
  });

  it('render component when PEC is enabled', () => {
    const { container, getByRole } = render(<LegalContactManager setAction={mockSetAction} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddresses,
        },
      },
    });

    expect(container).toHaveTextContent('status.active');
    const pecValue = digitalAddresses.find((addr) => addr.channelType === ChannelType.PEC)?.value!;
    expect(container).toHaveTextContent(pecValue);
    expect(container).toHaveTextContent(`${lblPrefix}.choose-action`);
    expect(container).toHaveTextContent(`${lblPrefix}.transfer.title-pec`);
    expect(container).toHaveTextContent(`${lblPrefix}.transfer.content-pec`);
    const transferBtn = getByRole('button', {
      name: `${lblPrefix}.transfer.action-pec`,
    });
    expect(transferBtn).toBeInTheDocument();

    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.title`);
    expect(container).toHaveTextContent(`${lblPrefix}.special_contacts.content`);
    const specialContactsBtn = getByRole('button', {
      name: `${lblPrefix}.special_contacts.action`,
    });
    expect(specialContactsBtn).toBeInTheDocument();

    fireEvent.click(transferBtn);
    expect(mockSetAction).toHaveBeenCalledTimes(1);
    expect(mockSetAction).toHaveBeenCalledWith(
      DigitalDomicileManagementAction.DIGITAL_DOMICILE_TRANSFER
    );
    fireEvent.click(specialContactsBtn);
    expect(mockSetAction).toHaveBeenCalledTimes(2);
    expect(mockSetAction).toHaveBeenCalledWith(DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT);
  });

  it('render component when PEC is validating', () => {
    const { container } = render(<LegalContactManager setAction={mockSetAction} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesPecValidation(false, false),
        },
      },
    });

    expect(container).toHaveTextContent('status.pec-validation');
  });

  it('render component when SERCQ SEND is enabled and PEC is validating', () => {
    const { container } = render(<LegalContactManager setAction={mockSetAction} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesPecValidation(true, false),
        },
      },
    });

    expect(container).toHaveTextContent('status.pec-validation');
    expect(container).toHaveTextContent(
      'legal-contacts.digital-domicile-management.sercq_send-active'
    );
  });
});
