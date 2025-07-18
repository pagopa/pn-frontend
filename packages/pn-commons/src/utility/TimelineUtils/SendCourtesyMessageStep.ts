import { DigitalDomicileType, SendCourtesyMessageDetails } from '../../models';
import { getLocalizedOrDefaultLabel } from '../localization.utility';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class SendCourtesyMessageStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    /* eslint-disable-next-line functional/no-let */
    let type = 'sms';
    const digitalType = (payload.step?.details as SendCourtesyMessageDetails).digitalAddress.type;
    if (digitalType === DigitalDomicileType.EMAIL) {
      type = 'email';
    }
    if (digitalType === DigitalDomicileType.APPIO) {
      type = 'app IO';
    }
    if (digitalType === DigitalDomicileType.TPP) {
      type = getLocalizedOrDefaultLabel(
        'notifications',
        'detail.timeline.tpp-type',
        'un canale digitale di terze parti'
      );
    }

    return {
      ...this.localizeTimelineStatus(
        `send-courtesy-message`,
        payload.isMultiRecipient,
        'Invio del messaggio di cortesia',
        `È in corso l'invio del messaggio di cortesia a ${payload.recipient?.denomination} tramite ${type}`,
        { ...this.nameAndTaxId(payload), type }
      ),
    };
  }
}
