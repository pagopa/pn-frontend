import {
  DigitalDomicileType,
  SendCourtesyMessageDetails,
} from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendCourtesyMessageStep extends TimelineStep {
  getTimelineStepInfo(
    payload: TimelineStepPayload
  ):  TimelineStepInfo| null {
     /* eslint-disable-next-line functional/no-let */
    let type = 'sms';
    const digitalType = (payload.step?.details as SendCourtesyMessageDetails).digitalAddress.type;
    if (digitalType === DigitalDomicileType.EMAIL) {
      type = 'email';
    }
    if (digitalType === DigitalDomicileType.APPIO) {
      type = 'app IO';
    }
    return {
      ...this.localizeTimelineStatus(
        'send-courtesy-message',
        'Invio del messaggio di cortesia',
        `È in corso l'invio del messaggio di cortesia a ${payload.recipient?.denomination} tramite ${type}`,
        {
          name: payload.recipient?.denomination,
          type,
        }
      ),
      recipient: payload.recipientLabel,
    };
  }
}
