import { PrepareAnalogDomicileFailureDetails } from '../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel, hasLocalizedLabel } from '../../utility/localization.utility';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

const titlePath = (failureCause: string) =>
  `detail.timeline.prepare-analog-domicile-failure-${failureCause}-title`;

export class PrepareAnalogDomicileFailureStep extends TimelineStep {
  getTimelineStepLabel(failureCause: string): string {
    // a title specific to the failure cause wins over the category one, and - as for the
    // description - a cause with no title of its own falls back to the XXX copy
    const path = [failureCause, 'XXX'].find((cause) =>
      hasLocalizedLabel('notifications', titlePath(cause))
    );

    if (path) {
      return getLocalizedOrDefaultLabel('notifications', titlePath(path));
    }

    return getLocalizedOrDefaultLabel(
      'notifications',
      `detail.timeline.prepare-analog-domicile-failure`,
      `Aggiornamento sull'invio cartaceo`
    );
  }

  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    const failureCause =
      (payload.step.details as PrepareAnalogDomicileFailureDetails).failureCause || 'ZZZ';

    const label = this.getTimelineStepLabel(failureCause);

    const addressData = this.completePhysicalAddressFromAddress(
      (payload.step.details as PrepareAnalogDomicileFailureDetails).foundAddress
    );

    // eslint-disable-next-line functional/no-let
    let description = getLocalizedOrDefaultLabel(
      'notifications',
      `detail.timeline.prepare-analog-domicile-failure-${failureCause}-description${
        payload.isMultiRecipient ? '-multirecipient' : ''
      }`,
      '',
      {
        ...this.nameAndTaxId(payload),
        ...addressData,
      }
    );

    if (description.length === 0) {
      description = getLocalizedOrDefaultLabel(
        'notifications',
        `detail.timeline.prepare-analog-domicile-failure-XXX-description${
          payload.isMultiRecipient ? '-multirecipient' : ''
        }`,
        `Non è stato trovato un indirizzo valido per predisporre un altro tentativo di invio - motivo sconosciuto.`,
        { failureCause, ...this.nameAndTaxId(payload) }
      );
    }

    return { label, description };
  }
}
