import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
export class TimelineStep {
    localizeTimelineStatus(category, isMultiRecipient, defaultLabel, defaultDescription, data) {
        return {
            label: getLocalizedOrDefaultLabel('notifications', `detail.timeline.${category}`, defaultLabel),
            description: getLocalizedOrDefaultLabel('notifications', `detail.timeline.${category}-description${isMultiRecipient ? '-multirecipient' : ''}`, defaultDescription, data),
        };
    }
    nameAndTaxId(payload) {
        return {
            name: payload.recipient?.denomination,
            taxId: payload.recipient ? `(${payload.recipient.taxId})` : '',
        };
    }
    completePhysicalAddress(step) {
        const physicalAddress = step.details.physicalAddress;
        const zip = physicalAddress && physicalAddress.zip ? ` (${physicalAddress.zip})` : '';
        const city = physicalAddress && physicalAddress?.municipality ? ` - ${physicalAddress.municipality}` : '';
        const country = physicalAddress && physicalAddress.foreignState ? ` ${physicalAddress.foreignState}` : '';
        return {
            address: physicalAddress ? `${physicalAddress.address}${city}${zip}${country}` : '',
            simpleAddress: physicalAddress ? physicalAddress.address : '',
        };
    }
}
