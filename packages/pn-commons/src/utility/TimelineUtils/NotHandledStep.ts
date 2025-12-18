import { NotHandledDetails } from '../../models/NotificationDetail';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

// PN-1647
export class NotHandledStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if (
      (payload.step.details as NotHandledDetails).reasonCode === '001' &&
      (payload.step.details as NotHandledDetails).reason === 'Paper message not handled'
    ) {
      return {
        label: 'Annullata',
        description: `La notifica è stata inviata per via cartacea, dopo un tentativo di invio per via digitale durante il collaudo della piattaforma.`,
      };
    }
    return null;
  }
}
