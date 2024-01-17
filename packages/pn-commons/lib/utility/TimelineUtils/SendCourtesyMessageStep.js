import { DigitalDomicileType } from '../../models';
import { TimelineStep } from './TimelineStep';
export class SendCourtesyMessageStep extends TimelineStep {
    getTimelineStepInfo(payload) {
        /* eslint-disable-next-line functional/no-let */
        let type = 'sms';
        const digitalType = (payload.step?.details).digitalAddress.type;
        if (digitalType === DigitalDomicileType.EMAIL) {
            type = 'email';
        }
        if (digitalType === DigitalDomicileType.APPIO) {
            type = 'app IO';
        }
        return {
            ...this.localizeTimelineStatus(`send-courtesy-message`, payload.isMultiRecipient, 'Invio del messaggio di cortesia', `È in corso l'invio del messaggio di cortesia a ${payload.recipient?.denomination} tramite ${type}`, { ...this.nameAndTaxId(payload), type }),
        };
    }
}
