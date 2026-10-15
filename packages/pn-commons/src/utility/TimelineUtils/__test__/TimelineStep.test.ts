import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { TimelineCategory } from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { initLocalizationExists } from '../../localization.utility';
import { TimelineStep, TimelineStepInfo } from '../TimelineStep';

class MockTimelineStep extends TimelineStep {
  getTimelineStepInfo(): TimelineStepInfo | null {
    return {
      label: 'mock-label',
      description: 'mock-description',
    };
  }
}

describe('TimelineStep', () => {
  const mockTimelineStep = new MockTimelineStep();

  beforeAll(() => {
    initLocalizationForTest();
  });

  it('getTimelineStepInfo', () => {
    expect(mockTimelineStep.getTimelineStepInfo()).toStrictEqual({
      label: 'mock-label',
      description: `mock-description`,
    });
  });

  it('localizeTimelineStatus', () => {
    // mono recipient
    expect(
      mockTimelineStep.localizeTimelineStatus(
        'mock-category',
        false,
        'mock-label',
        'mock-description',
        { 'mock-key': 'mock-value' }
      )
    ).toStrictEqual({
      description: `notifiche - detail.timeline.mock-category-description - ${JSON.stringify({
        'mock-key': 'mock-value',
      })}`,
      label: 'notifiche - detail.timeline.mock-category',
    });
    // multi recipient
    expect(
      mockTimelineStep.localizeTimelineStatus(
        'mock-category',
        true,
        'mock-label',
        'mock-description',
        { 'mock-key': 'mock-value' }
      )
    ).toStrictEqual({
      description: `notifiche - detail.timeline.mock-category-description-multirecipient - ${JSON.stringify(
        {
          'mock-key': 'mock-value',
        }
      )}`,
      label: 'notifiche - detail.timeline.mock-category',
    });
  });

  it('localizeTimelineStatus - delegate view with the delegate description', () => {
    initLocalizationExists(
      (_ns, path) => path === 'detail.timeline.mock-category-description-delegate'
    );
    expect(
      mockTimelineStep.localizeTimelineStatus(
        'mock-category',
        true,
        'mock-label',
        'mock-description',
        { 'mock-key': 'mock-value' },
        'Mario Cucumber'
      )
    ).toStrictEqual({
      description: `notifiche - detail.timeline.mock-category-description-delegate - ${JSON.stringify(
        {
          'mock-key': 'mock-value',
          recipient: 'Mario Cucumber',
        }
      )}`,
      label: 'notifiche - detail.timeline.mock-category',
    });
    initLocalizationForTest();
  });

  it.each([false, true])(
    'localizeTimelineStatus - delegate view without the delegate description, multi recipient %s',
    (isMultiRecipient) => {
      const args = [
        'mock-category',
        isMultiRecipient,
        'mock-label',
        'mock-description',
        { 'mock-key': 'mock-value' },
      ] as const;
      expect(mockTimelineStep.localizeTimelineStatus(...args, 'Mario Cucumber')).toStrictEqual(
        mockTimelineStep.localizeTimelineStatus(...args)
      );
    }
  );

  it('localizeTimelineStatus - delegate description ignored outside the delegate view', () => {
    initLocalizationExists(
      (_ns, path) => path === 'detail.timeline.mock-category-description-delegate'
    );
    expect(
      mockTimelineStep.localizeTimelineStatus(
        'mock-category',
        false,
        'mock-label',
        'mock-description'
      )
    ).toStrictEqual({
      description: 'notifiche - detail.timeline.mock-category-description',
      label: 'notifiche - detail.timeline.mock-category',
    });
    initLocalizationForTest();
  });

  it('nameAndTaxId', () => {
    const payload = {
      step: getTimelineElem(TimelineCategory.NOT_HANDLED, { recIndex: 0 }),
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    expect(mockTimelineStep.nameAndTaxId(payload)).toStrictEqual({
      name: notificationDTO.recipients[0].denomination,
      taxId: `(${notificationDTO.recipients[0].taxId})`,
    });
  });

  it('completePhysicalAddress', () => {
    const physicalAddress = {
      at: '',
      addressDetails: '',
      address: 'Via Mazzini 1848',
      zip: '98036',
      municipality: 'Graniti',
      province: '',
      foreignState: 'Italy',
    };
    let timelineElem = getTimelineElem(TimelineCategory.ANALOG_SUCCESS_WORKFLOW, {
      recIndex: 0,
      physicalAddress,
    });
    // physical address filled
    expect(mockTimelineStep.completePhysicalAddressFromStep(timelineElem)).toStrictEqual({
      address: `${physicalAddress.address} - ${physicalAddress.municipality} (${physicalAddress.zip}) ${physicalAddress.foreignState}`,
      simpleAddress: `${physicalAddress.address}`,
    });
    // physical address empty
    timelineElem = getTimelineElem(TimelineCategory.ANALOG_SUCCESS_WORKFLOW, {
      recIndex: 0,
      physicalAddress: {
        at: '',
        addressDetails: '',
        address: '',
        zip: '',
        municipality: '',
        province: '',
        foreignState: '',
      },
    });
    expect(mockTimelineStep.completePhysicalAddressFromStep(timelineElem)).toStrictEqual({
      address: ``,
      simpleAddress: ``,
    });
  });
});
