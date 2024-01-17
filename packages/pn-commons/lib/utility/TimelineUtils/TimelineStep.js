import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
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
    completePhysicalAddressFromStep(step) {
        return this.completePhysicalAddressFromAddress(step.details.physicalAddress);
    }
    completePhysicalAddressFromAddress(physicalAddress) {
        const zip = physicalAddress?.zip ? ` (${physicalAddress.zip})` : '';
        const city = physicalAddress?.municipality ? ` - ${physicalAddress.municipality}` : '';
        const country = physicalAddress?.foreignState ? ` ${physicalAddress.foreignState}` : '';
        return {
            address: physicalAddress ? `${physicalAddress.address}${city}${zip}${country}` : '',
            simpleAddress: physicalAddress ? physicalAddress.address : '',
        };
    }
}
