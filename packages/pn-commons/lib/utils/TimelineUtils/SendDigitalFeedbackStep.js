import { TimelineStep } from './TimelineStep';
export class SendDigitalFeedbackStep extends TimelineStep {
    getTimelineStepInfo(payload) {
        if (payload.step.details.responseStatus === 'KO') {
            return {
                ...this.localizeTimelineStatus('send-digital-error', payload.isMultiRecipient, 'Invio via PEC non riuscito', `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${payload.step.details.digitalAddress?.address} non è riuscito perché la casella è satura, non valida o inattiva.`, {
                    ...this.nameAndTaxId(payload),
                    address: payload.step.details.digitalAddress?.address,
                }),
            };
        }
        return {
            ...this.localizeTimelineStatus('send-digital-success', payload.isMultiRecipient, 'Invio via PEC riuscito', `L'invio della notifica a ${payload.recipient?.denomination} all'indirizzo PEC ${payload.step.details.digitalAddress?.address} è riuscito.`, {
                ...this.nameAndTaxId(payload),
                address: payload.step.details.digitalAddress?.address,
            }),
        };
    }
}
