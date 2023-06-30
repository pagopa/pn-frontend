import { LegalChannelType, CourtesyChannelType } from "../../../models/contacts";
import { CONTACTS_LIST, COURTESY_CONTACT, LEGAL_CONTACT } from "../contacts.routes";

describe('Contacts routes', () => {
  it('should compile CONTACTS_LIST', () => {
    const route = CONTACTS_LIST();
    expect(route).toEqual(`/address-book/v1/digital-address`);
  });

  it('should compile LEGAL_CONTACT', () => {
    const route = LEGAL_CONTACT('mocked-senderId', LegalChannelType.PEC);
    expect(route).toEqual(`/address-book/v1/digital-address/legal/mocked-senderId/${LegalChannelType.PEC}`);
  });

  it('should compile COURTESY_CONTACT', () => {
    const route = COURTESY_CONTACT('mocked-senderId', CourtesyChannelType.SMS);
    expect(route).toEqual(`/address-book/v1/digital-address/courtesy/mocked-senderId/${CourtesyChannelType.SMS}`);
  });
});
