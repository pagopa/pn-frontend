import { TimelineStep } from './TimelineStep';
export class SendSimpleRegisteredLetterStep extends TimelineStep {
    getTimelineStepInfo(payload) {
        return {
            ...this.localizeTimelineStatus('send-simple-registered-letter', payload.isMultiRecipient, 'Invio via raccomandata semplice', `È in corso l'invio della notifica a ${payload.recipient?.denomination} all'indirizzo ${payload.step.details.physicalAddress?.address} tramite raccomandata semplice.`, {
                ...this.nameAndTaxId(payload),
                ...this.completePhysicalAddressFromStep(payload.step),
            }),
        };
    }
}
