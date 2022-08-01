import {
  DigitalDomicileType,
  SendCourtesyMessageDetails,
} from '../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendCourtesyMessageStep extends TimelineStep {
  getTimelineStepInfo(
    payload: TimelineStepPayload
  ):  TimelineStepInfo| null {
    const type =
      (payload.step?.details as SendCourtesyMessageDetails).digitalAddress.type ===
      DigitalDomicileType.EMAIL
        ? 'email'
        : 'sms';
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
