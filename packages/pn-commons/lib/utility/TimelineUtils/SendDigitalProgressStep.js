import { TimelineStep } from './TimelineStep';
export class SendDigitalProgressStep extends TimelineStep {
    getTimelineStepInfo(payload) {
        const deliveryDetailCode = payload.step.details.deliveryDetailCode;
        if (deliveryDetailCode === 'C008' ||
            deliveryDetailCode === 'C010' ||
            deliveryDetailCode === 'DP10') {
            return {
                ...this.localizeTimelineStatus('send-digital-progress-error', payload.isMultiRecipient, 'Invio via PEC non preso in carico', `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${payload.step.details.digitalAddress?.address} non è stato preso in carico.`, {
                    ...this.nameAndTaxId(payload),
                    address: payload.step.details.digitalAddress?.address,
                }),
            };
        }
        else if (deliveryDetailCode === 'C001' || deliveryDetailCode === 'DP00') {
            return {
                ...this.localizeTimelineStatus('send-digital-progress-success', payload.isMultiRecipient, 'Invio via PEC preso in carico', `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${payload.step.details.digitalAddress?.address} è stato preso in carico.`, {
                    ...this.nameAndTaxId(payload),
                    address: payload.step.details.digitalAddress?.address,
                }),
            };
        }
        return null;
    }
}
