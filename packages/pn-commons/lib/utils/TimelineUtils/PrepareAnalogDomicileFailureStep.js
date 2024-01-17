import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { TimelineStep } from "./TimelineStep";
export class PrepareAnalogDomicileFailureStep extends TimelineStep {
    getTimelineStepLabel() {
        return getLocalizedOrDefaultLabel('notifications', `detail.timeline.prepare-analog-domicile-failure`, `Aggiornamento sull'invio cartaceo`);
    }
    getTimelineStepInfo(payload) {
        // label - separate method just to avoid "cognitive complexity" eslint errors
        // ///////////////////////////////////////////////////////////////
        const label = this.getTimelineStepLabel();
        // details
        // ///////////////////////////////////////////////////////////////
        const failureCause = payload.step.details.failureCause || 'ZZZ';
        const addressData = this.completePhysicalAddressFromAddress(payload.step.details.foundAddress);
        // eslint-disable-next-line functional/no-let
        let description = getLocalizedOrDefaultLabel('notifications', `detail.timeline.prepare-analog-domicile-failure-${failureCause}-description${payload.isMultiRecipient ? '-multirecipient' : ''}`, '', {
            ...this.nameAndTaxId(payload),
            ...addressData,
        });
        if (description.length === 0) {
            description = getLocalizedOrDefaultLabel('notifications', `detail.timeline.prepare-analog-domicile-failure-XXX-description${payload.isMultiRecipient ? '-multirecipient' : ''}`, `Non è stato trovato un indirizzo valido per predisporre un altro tentativo di invio - motivo sconosciuto.`, { failureCause, ...this.nameAndTaxId(payload), });
        }
        return { label, description };
    }
}
