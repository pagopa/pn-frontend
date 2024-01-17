import { TimelineStep } from './TimelineStep';
export class ScheduleDigitalWorkflowStep extends TimelineStep {
    getTimelineStepInfo(payload) {
        return {
            ...this.localizeTimelineStatus('schedule-digital-workflow', payload.isMultiRecipient, 'Invio per via digitale in preparazione', `L'invio della notifica per via digitale a ${payload.recipient?.denomination} è in preparazione.`, this.nameAndTaxId(payload)),
        };
    }
}
