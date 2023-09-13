import { mockTimelineStepAnalogFailureWorkflow } from '../../../__mocks__/TimelineStep.mock';
import { AnalogWorkflowDetails } from '../../../types';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from '../TimelineStep';

class MockTimelineStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'mock-workflow',
        payload.isMultiRecipient,
        'mock-label',
        `mock-description`,
        this.nameAndTaxId(payload)
      ),
    };
  }
}

describe('TimelineStep', () => {
  const mockTimelineStep = new MockTimelineStep();

  it('getTimelineStepInfo', () => {
    expect(
      mockTimelineStep.getTimelineStepInfo(mockTimelineStepAnalogFailureWorkflow)
    ).toStrictEqual({
      label: 'mock-label',
      description: `mock-description`,
    });
  });

  it('localizeTimelineStatus', () => {
    expect(
      mockTimelineStep.localizeTimelineStatus(
        'mock-category',
        true,
        'mock-label',
        'mock-description',
        { 'mock-key': 'mock-value' }
      )
    ).toStrictEqual({
      description: 'mock-description',
      label: 'mock-label',
    });
  });

  it('nameAndTaxId', () => {
    expect(mockTimelineStep.nameAndTaxId(mockTimelineStepAnalogFailureWorkflow)).toStrictEqual({
      name: mockTimelineStepAnalogFailureWorkflow.recipient?.denomination,
      taxId: `(${mockTimelineStepAnalogFailureWorkflow.recipient?.taxId})`,
    });
  });

  it('completePhysicalAddress', () => {
    const physycalAddress = (
      mockTimelineStepAnalogFailureWorkflow.step.details as AnalogWorkflowDetails
    ).physicalAddress;

    expect(
      mockTimelineStep.completePhysicalAddress(mockTimelineStepAnalogFailureWorkflow.step)
    ).toStrictEqual({
      address: `${physycalAddress?.address} - ${physycalAddress?.municipality} (${physycalAddress?.zip}) ${physycalAddress?.foreignState}`,
      simpleAddress: `${physycalAddress?.address}`,
    });
  });
});
