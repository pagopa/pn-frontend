import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { TimelineCategory } from '../../../models/NotificationDetail';
import { PrepareAnalogDomicileFailureDetails } from '../../../models/NotificationDetail';
import { initLocalization } from '../../../utility/localization.utility';
import { PrepareAnalogDomicileFailureStep } from '../PrepareAnalogDomicileFailureStep';

const physicalAddress = {
  at: '',
  addressDetails: '',
  address: 'Via Mazzini 1848',
  zip: '98036',
  municipality: 'Graniti',
  province: '',
  foreignState: 'Italy',
};

describe('PrepareAnalogDomicileFailureStep', () => {
  beforeAll(() => {
    const mockedTranslationFn = (
      namespace: string | Array<string>,
      path: string,
      data?: { [key: string]: any | undefined }
    ) => {
      if (path.includes('D08')) {
        return '';
      }
      return data ? `${namespace} - ${path} - ${JSON.stringify(data)}` : `${namespace} - ${path}`;
    };
    initLocalization(mockedTranslationFn);
  });

  it('test getTimelineStepInfo with failureCause known', () => {
    const timelineElem = getTimelineElem(TimelineCategory.PREPARE_ANALOG_DOMICILE_FAILURE, {
      foundAddress: physicalAddress,
      failureCause: 'D02',
    } as PrepareAnalogDomicileFailureDetails);
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    // mono recipient
    const prepareAnalogDomicileFailureStep = new PrepareAnalogDomicileFailureStep();
    expect(prepareAnalogDomicileFailureStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.prepare-analog-domicile-failure`,
      description: `notifiche - detail.timeline.prepare-analog-domicile-failure-D02-description - ${JSON.stringify(
        {
          ...prepareAnalogDomicileFailureStep.nameAndTaxId(payload),
          ...prepareAnalogDomicileFailureStep.completePhysicalAddressFromAddress(
            (payload.step.details as PrepareAnalogDomicileFailureDetails).foundAddress
          ),
        }
      )}`,
    });
    // multi recipient
    expect(
      prepareAnalogDomicileFailureStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.prepare-analog-domicile-failure`,
      description: `notifiche - detail.timeline.prepare-analog-domicile-failure-D02-description-multirecipient - ${JSON.stringify(
        {
          ...prepareAnalogDomicileFailureStep.nameAndTaxId(payload),
          ...prepareAnalogDomicileFailureStep.completePhysicalAddressFromAddress(
            (payload.step.details as PrepareAnalogDomicileFailureDetails).foundAddress
          ),
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo without failureCause', () => {
    const timelineElem = getTimelineElem(TimelineCategory.PREPARE_ANALOG_DOMICILE_FAILURE, {
      foundAddress: physicalAddress,
    } as PrepareAnalogDomicileFailureDetails);
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    // mono recipient
    const prepareAnalogDomicileFailureStep = new PrepareAnalogDomicileFailureStep();
    expect(prepareAnalogDomicileFailureStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.prepare-analog-domicile-failure`,
      description: `notifiche - detail.timeline.prepare-analog-domicile-failure-ZZZ-description - ${JSON.stringify(
        {
          ...prepareAnalogDomicileFailureStep.nameAndTaxId(payload),
          ...prepareAnalogDomicileFailureStep.completePhysicalAddressFromAddress(
            (payload.step.details as PrepareAnalogDomicileFailureDetails).foundAddress
          ),
        }
      )}`,
    });
    // multi recipient
    expect(
      prepareAnalogDomicileFailureStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.prepare-analog-domicile-failure`,
      description: `notifiche - detail.timeline.prepare-analog-domicile-failure-ZZZ-description-multirecipient - ${JSON.stringify(
        {
          ...prepareAnalogDomicileFailureStep.nameAndTaxId(payload),
          ...prepareAnalogDomicileFailureStep.completePhysicalAddressFromAddress(
            (payload.step.details as PrepareAnalogDomicileFailureDetails).foundAddress
          ),
        }
      )}`,
    });
  });

  it('test getTimelineStepInfo with failureCause unknown', () => {
    const timelineElem = getTimelineElem(TimelineCategory.PREPARE_ANALOG_DOMICILE_FAILURE, {
      foundAddress: physicalAddress,
      failureCause: 'D08',
    } as PrepareAnalogDomicileFailureDetails);
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    // mono recipient
    const prepareAnalogDomicileFailureStep = new PrepareAnalogDomicileFailureStep();
    expect(prepareAnalogDomicileFailureStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.prepare-analog-domicile-failure`,
      description: `notifiche - detail.timeline.prepare-analog-domicile-failure-XXX-description - ${JSON.stringify(
        {
          failureCause: 'D08',
          ...prepareAnalogDomicileFailureStep.nameAndTaxId(payload),
        }
      )}`,
    });
    // multi recipient
    expect(
      prepareAnalogDomicileFailureStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.prepare-analog-domicile-failure`,
      description: `notifiche - detail.timeline.prepare-analog-domicile-failure-XXX-description-multirecipient - ${JSON.stringify(
        {
          failureCause: 'D08',
          ...prepareAnalogDomicileFailureStep.nameAndTaxId(payload),
        }
      )}`,
    });
  });
});
