import { vi } from 'vitest';

import { digitalAddresses, digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import LegalContactManager, { DigitalDomicileManagementAction } from '../LegalContactManager';

const mockSetAction = vi.fn();

describe('LegalContactManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('render component when SERCQ SEND is enabled', () => {
    const { getByText, getByRole } = render(<LegalContactManager setAction={mockSetAction} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddressesSercq,
        },
      },
    });

    getByText('status.active');
    getByText('legal-contacts.digital-domicile-management.sercq_send-active');
    getByText('legal-contacts.digital-domicile-management.choose-action');
    getByText('legal-contacts.digital-domicile-management.transfer.title-sercq_send');
    getByText('legal-contacts.digital-domicile-management.transfer.content-sercq_send');
    const transferBtn = getByRole('button', {
      name: 'legal-contacts.digital-domicile-management.transfer.action-sercq_send',
    });
    expect(transferBtn).toBeInTheDocument();

    getByText('legal-contacts.digital-domicile-management.special_contacts.title');
    getByText('legal-contacts.digital-domicile-management.special_contacts.content');
    const specialContactsBtn = getByRole('button', {
      name: 'legal-contacts.digital-domicile-management.special_contacts.action',
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
    const { getByText, getByRole } = render(<LegalContactManager setAction={mockSetAction} />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalAddresses,
        },
      },
    });

    getByText('status.active');
    const pecValue = digitalAddresses.find((addr) => addr.channelType === ChannelType.PEC)?.value!;
    getByText(pecValue);
    getByText('legal-contacts.digital-domicile-management.choose-action');
    getByText('legal-contacts.digital-domicile-management.transfer.title-pec');
    getByText('legal-contacts.digital-domicile-management.transfer.content-pec');
    const transferBtn = getByRole('button', {
      name: 'legal-contacts.digital-domicile-management.transfer.action-pec',
    });
    expect(transferBtn).toBeInTheDocument();

    getByText('legal-contacts.digital-domicile-management.special_contacts.title');
    getByText('legal-contacts.digital-domicile-management.special_contacts.content');
    const specialContactsBtn = getByRole('button', {
      name: 'legal-contacts.digital-domicile-management.special_contacts.action',
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
});
