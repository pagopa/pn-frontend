import { ResponseStatus } from '../../types/NotificationDetail';
import { SendPaperDetails } from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendAnalogFeedbackStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    if ((payload.step.details as SendPaperDetails).responseStatus === ResponseStatus.KO) {
      return {
        ...this.localizeTimelineStatus(
          'send-analog-error',
          payload.isMultiRecipient, 
          'Invio per via cartacea non riuscito',
          `Il tentativo di invio della notifica per via cartacea a ${payload.recipient?.denomination} non è riuscito.`,
          this.nameAndTaxId(payload),
        ),
      };
    }
    return {
      ...this.localizeTimelineStatus(
        'send-analog-success',
        payload.isMultiRecipient, 
        'Invio per via cartacea riuscito',
        `Il tentativo di invio della notifica per via cartacea a ${payload.recipient?.denomination} è riuscito.`,
        this.nameAndTaxId(payload),
      ),
    };
  }
}
