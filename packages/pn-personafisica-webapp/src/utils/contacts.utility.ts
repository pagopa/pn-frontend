import {CourtesyChannelType, LegalChannelType} from "../models/contacts";
import {TrackEventType} from "./events";

export const phoneRegExp = /3\d{2}[. ]??\d{6,7}/g;
export const internationalPhonePrefix = '+39';

export const getContactEventType = (type: CourtesyChannelType | LegalChannelType.IOPEC) => {
    switch (type) {
        case CourtesyChannelType.EMAIL:
            return TrackEventType.CONTACT_MAIL_COURTESY;
        case CourtesyChannelType.IOMSG:
            return TrackEventType.CONTACT_IOAPP_COURTESY;
        default:
            return TrackEventType.CONTACT_TEL_COURTESY;
    }
};