import { TimelineStep } from './TimelineStep';
// PN-6902
export class AnalogFailureWorkflowStep extends TimelineStep {
    getTimelineStepInfo(payload) {
        return {
            ...this.localizeTimelineStatus('analog-failure-workflow', payload.isMultiRecipient, 'Invio analogico assolutamente fallimentare', `Invio analogico a ${payload.recipient?.denomination} assolutamente fallimentare.`, this.nameAndTaxId(payload)),
        };
    }
}
