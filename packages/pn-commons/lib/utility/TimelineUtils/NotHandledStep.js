import { TimelineStep } from './TimelineStep';
// PN-1647
export class NotHandledStep extends TimelineStep {
    getTimelineStepInfo(payload) {
        if (payload.step.details.reasonCode === '001' &&
            payload.step.details.reason === 'Paper message not handled') {
            return {
                label: 'Annullata',
                description: `La notifica è stata inviata per via cartacea, dopo un tentativo di invio per via digitale durante il collaudo della piattaforma.`,
            };
        }
        return null;
    }
}
