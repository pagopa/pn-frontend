import { TimelineStep } from './TimelineStep';
export class SendDigitalDomicileStep extends TimelineStep {
    getTimelineStepInfo(payload) {
        if (!payload.step.details.digitalAddress?.address) {
            // if digital domicile is undefined
            return null;
        }
        return {
            ...this.localizeTimelineStatus('send-digital-domicile', payload.isMultiRecipient, 'Invio via PEC', `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${payload.step.details.digitalAddress?.address}`, {
                ...this.nameAndTaxId(payload),
                address: payload.step.details.digitalAddress?.address,
            }),
        };
    }
}
