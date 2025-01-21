import { vi } from 'vitest';

import { digitalAddresses, digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import * as routes from '../../../navigation/routes.const';
import LegalContactManager from '../LegalContactManager';

const mockNavigateFn = vi.fn();
const mockGoToNextStep = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('LegalContactManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('render component when SERCQ SEND is enabled', () => {
    const { getByText, getByRole } = render(
      <LegalContactManager goToNextStep={mockGoToNextStep} />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: digitalAddressesSercq,
          },
        },
      }
    );

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
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.DIGITAL_DOMICILE_TRANSFER);
    fireEvent.click(specialContactsBtn);
    expect(mockGoToNextStep).toHaveBeenCalledTimes(1);
  });

  it('render component when PEC is enabled', () => {
    const { getByText, getByRole } = render(
      <LegalContactManager goToNextStep={mockGoToNextStep} />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: digitalAddresses,
          },
        },
      }
    );

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
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(routes.DIGITAL_DOMICILE_TRANSFER);
    fireEvent.click(specialContactsBtn);
    expect(mockGoToNextStep).toHaveBeenCalledTimes(1);
  });
});
