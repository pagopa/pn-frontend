import {CourtesyChannelType, DigitalAddress} from "../models/contacts";

export const phoneRegExp = /3\d{2}[. ]??\d{6,7}/g;
export const internationalPhonePrefix = '+39';


export function countContactsByType(contacts: Array<DigitalAddress>, type: CourtesyChannelType) {
    return contacts.reduce((total, contact) =>
        contact.channelType === type
            ? total + 1
            : total, 0
    );
}
