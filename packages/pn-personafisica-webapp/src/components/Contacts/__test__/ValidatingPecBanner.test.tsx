import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { render, within } from '../../../__test__/test-utils';
import { AddressType, ChannelType } from '../../../models/contacts';
import ValidatingPecBanner from '../ValidatingPecBanner';

const sercqAddr = {
  addressType: AddressType.LEGAL,
  senderId: 'default',
  channelType: ChannelType.SERCQ_SEND,
  value: SERCQ_SEND_VALUE,
  codeValid: true,
};

const validatingDefaultPecNoSercq = digitalAddresses.map((addr) =>
  addr.senderId === 'default' && addr.addressType === AddressType.LEGAL
    ? { ...addr, pecValid: false }
    : addr
);

const validatingDefaultPecSercq = [...validatingDefaultPecNoSercq, sercqAddr];

const validatingPartyPecNoSercq = digitalAddresses.map((addr) =>
  addr.senderId === 'comune-milano' ? { ...addr, pecValid: false } : addr
);

const validatingPartyPecSercq = [...validatingPartyPecNoSercq, sercqAddr];

const validatingDefaultAndPartyPecSercq = validatingPartyPecSercq.map((addr) =>
  addr.senderId === 'default' && addr.channelType === ChannelType.PEC
    ? { ...addr, pecValid: false }
    : addr
);

describe('ValidatingPecBanner component', () => {
  it('shows the component while validating default PEC - SERCQ SEND not enabled', () => {
    const { getByTestId, getByText } = render(<ValidatingPecBanner />, {
      preloadedState: { contactsState: { digitalAddresses: validatingDefaultPecNoSercq } },
    });

    const alert = getByTestId('PecVerificationAlert');
    const icon = within(alert).getByTestId('ReportProblemOutlinedIcon');
    expect(icon).toBeInTheDocument();
    getByText('legal-contacts.pec-validation-banner.title');
    getByText('legal-contacts.pec-validation-banner.dod-disabled-message');
  });

  it('shows the component while validating default PEC - SERCQ SEND previously enabled', () => {
    const { getByTestId, getByText } = render(<ValidatingPecBanner />, {
      preloadedState: { contactsState: { digitalAddresses: validatingDefaultPecSercq } },
    });

    const alert = getByTestId('PecVerificationAlert');
    const icon = within(alert).getByTestId('ReportProblemOutlinedIcon');
    expect(icon).toBeInTheDocument();
    getByText('legal-contacts.pec-validation-banner.title');
    getByText('legal-contacts.pec-validation-banner.dod-enabled-message');
  });

  it("shows the component while validating a party's PEC - default SERCQ SEND enabled", () => {
    const { getByTestId, getByText } = render(<ValidatingPecBanner />, {
      preloadedState: { contactsState: { digitalAddresses: validatingPartyPecSercq } },
    });

    const alert = getByTestId('PecVerificationAlert');
    const icon = within(alert).getByTestId('ReportProblemOutlinedIcon');
    expect(icon).toBeInTheDocument();
    getByText('legal-contacts.pec-validation-banner.title');
    getByText('legal-contacts.pec-validation-banner.parties-list');
  });

  it("shows the component while validating default and party's PEC - default SERCQ SEND enabled", () => {
    const { getByTestId, getByText } = render(<ValidatingPecBanner />, {
      preloadedState: { contactsState: { digitalAddresses: validatingDefaultAndPartyPecSercq } },
    });

    const alert = getByTestId('PecVerificationAlert');
    const icon = within(alert).getByTestId('ReportProblemOutlinedIcon');
    expect(icon).toBeInTheDocument();
    getByText('legal-contacts.pec-validation-banner.title');
    getByText('legal-contacts.pec-validation-banner.dod-enabled-message');
  });

  it("doesn't show the component if there is no validating PEC", () => {
    const { queryByTestId, queryByText } = render(<ValidatingPecBanner />, {
      preloadedState: { contactsState: { digitalAddresses } },
    });

    expect(queryByTestId('PecVerificationAlert')).not.toBeInTheDocument();
    expect(queryByTestId('ReportProblemOutlinedIcon')).not.toBeInTheDocument();
    const bannerTitle = queryByText('legal-contacts.pec-validation-banner.title');
    const bannerMessage = queryByText('legal-contacts.pec-validation-banner.dod-enabled-message');

    expect(bannerTitle).not.toBeInTheDocument();
    expect(bannerMessage).not.toBeInTheDocument();
  });
});
