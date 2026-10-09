import { getTimelineElem, notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import {
  DigitalDomicileType,
  LegalFactType,
  TimelineCategory,
} from '../../../models/NotificationDetail';
import { initLocalizationForTest } from '../../../test-utils';
import { initLocalizationExists } from '../../localization.utility';
import { SendDigitalProgressStep } from '../SendDigitalProgressStep';

describe('SendDigitalProgressStep', () => {
  const errorDeliveryCodes = ['C008', 'C010', 'DP10'];
  const successDeliveryCodes = ['C001', 'DP00'];

  beforeAll(() => {
    initLocalizationForTest();
  });

  it.each(errorDeliveryCodes)(`test getTimelineStepInfo with deliveryDetailCode %s`, (code) => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_PROGRESS, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      deliveryDetailCode: code,
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalProgressStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-progress-error`,
      description: `notifiche - detail.timeline.send-digital-progress-error-description - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
    // multi recipient
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-progress-error`,
      description: `notifiche - detail.timeline.send-digital-progress-error-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
  });

  it.each(successDeliveryCodes)(`test getTimelineStepInfo with deliveryDetailCode %s`, (code) => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_PROGRESS, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      deliveryDetailCode: code,
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalProgressStep();
    // mono recipient
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-progress-success`,
      description: `notifiche - detail.timeline.send-digital-progress-success-description - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
    // multi recipient
    expect(
      sendDigitalDomicileStep.getTimelineStepInfo({ ...payload, isMultiRecipient: true })
    ).toStrictEqual({
      label: `notifiche - detail.timeline.send-digital-progress-success`,
      description: `notifiche - detail.timeline.send-digital-progress-success-description-multirecipient - ${JSON.stringify(
        {
          ...sendDigitalDomicileStep.nameAndTaxId(payload),
          address: 'nome.cognome@pec.it',
        }
      )}`,
    });
  });

  it.each([
    { code: 'C008', outcome: 'error' },
    { code: 'C010', outcome: 'error' },
    { code: 'DP10', outcome: 'error' },
    { code: 'C001', outcome: 'success' },
    { code: 'DP00', outcome: 'success' },
  ])(
    'test getTimelineStepInfo with deliveryDetailCode $code and PEC receipt availability',
    ({ code, outcome }) => {
      const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_PROGRESS, {
        digitalAddress: {
          address: 'nome.cognome@pec.it',
          type: DigitalDomicileType.PEC,
        },
        deliveryDetailCode: code,
      });

      timelineElem.legalFactsIds = [];

      const sendDigitalProgressStep = new SendDigitalProgressStep();

      const payload = {
        step: timelineElem,
        recipient: notificationDTO.recipients[0],
        isMultiRecipient: false,
      };

      const translationData = {
        ...sendDigitalProgressStep.nameAndTaxId(payload),
        address: 'nome.cognome@pec.it',
      };

      // Fallback: no-receipt translation unavailable
      expect(sendDigitalProgressStep.getTimelineStepInfo(payload)).toStrictEqual({
        label: `notifiche - detail.timeline.send-digital-progress-${outcome}`,
        description: `notifiche - detail.timeline.send-digital-progress-${outcome}-description - ${JSON.stringify(
          translationData
        )}`,
      });

      try {
        initLocalizationExists(
          (_, path) =>
            path === `detail.timeline.send-digital-progress-${outcome}-description-no-receipt` ||
            path ===
              `detail.timeline.send-digital-progress-${outcome}-description-no-receipt-delegate` ||
            path === `detail.timeline.send-digital-progress-${outcome}-description-delegate`
        );
        // No PEC receipt
        expect(sendDigitalProgressStep.getTimelineStepInfo(payload)).toStrictEqual({
          label: `notifiche - detail.timeline.send-digital-progress-${outcome}`,
          description: `notifiche - detail.timeline.send-digital-progress-${outcome}-description-no-receipt - ${JSON.stringify(
            translationData
          )}`,
        });

        // PEC receipt available
        const payloadWithReceipt = {
          ...payload,
          step: {
            ...timelineElem,
            legalFactsIds: [
              {
                category: LegalFactType.PEC_RECEIPT,
                key: 'safestorage://test-pec-receipt.xml',
              },
            ],
          },
        };

        expect(sendDigitalProgressStep.getTimelineStepInfo(payloadWithReceipt)).toStrictEqual({
          label: `notifiche - detail.timeline.send-digital-progress-${outcome}`,
          description: `notifiche - detail.timeline.send-digital-progress-${outcome}-description - ${JSON.stringify(
            translationData
          )}`,
        });

        // Delegate without PEC receipt
        const payloadDelegate = {
          ...payload,
          delegatorName: 'Test Delegator',
        };

        expect(sendDigitalProgressStep.getTimelineStepInfo(payloadDelegate)).toStrictEqual({
          label: `notifiche - detail.timeline.send-digital-progress-${outcome}`,
          description: `notifiche - detail.timeline.send-digital-progress-${outcome}-description-no-receipt-delegate - ${JSON.stringify(
            {
              ...translationData,
              recipient: 'Test Delegator',
            }
          )}`,
        });

        // Delegate with PEC receipt
        expect(
          sendDigitalProgressStep.getTimelineStepInfo({
            ...payloadWithReceipt,
            delegatorName: 'Test Delegator',
          })
        ).toStrictEqual({
          label: `notifiche - detail.timeline.send-digital-progress-${outcome}`,
          description: `notifiche - detail.timeline.send-digital-progress-${outcome}-description-delegate - ${JSON.stringify(
            {
              ...translationData,
              recipient: 'Test Delegator',
            }
          )}`,
        });
      } finally {
        initLocalizationExists(() => false);
      }
    }
  );

  it(`test getTimelineStepInfo with unhandled deliveryDetailCode`, () => {
    const timelineElem = getTimelineElem(TimelineCategory.SEND_DIGITAL_PROGRESS, {
      digitalAddress: {
        address: 'nome.cognome@pec.it',
        type: DigitalDomicileType.PEC,
      },
      deliveryDetailCode: 'INVCD',
    });
    const payload = {
      step: timelineElem,
      recipient: notificationDTO.recipients[0],
      isMultiRecipient: false,
    };
    const sendDigitalDomicileStep = new SendDigitalProgressStep();
    expect(sendDigitalDomicileStep.getTimelineStepInfo(payload)).toStrictEqual(null);
  });
});
