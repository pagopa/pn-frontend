import _ from 'lodash';

import { mockTimelineStepSendDigitalFeedback } from '../../../__mocks__/TimelineStep.mock';
import { TimelineCategory } from '../../../types';
import { AnalogFailureWorkflowStep } from '../AnalogFailureWorkflowStep';
import { DefaultStep } from '../DefaultStep';
import { NotHandledStep } from '../NotHandledStep';
import { ScheduleDigitalWorkflowStep } from '../ScheduleDigitalWorkflowStep';
import { SendAnalogDomicileStep } from '../SendAnalogDomicileStep';
import { SendAnalogFlowStep } from '../SendAnalogFlowStep';
import { SendCourtesyMessageStep } from '../SendCourtesyMessageStep';
import { SendDigitalDomicileStep } from '../SendDigitalDomicileStep';
import { SendDigitalFeedbackStep } from '../SendDigitalFeedbackStep';
import { SendDigitalProgressStep } from '../SendDigitalProgressStep';
import { SendSimpleRegisteredLetterStep } from '../SendSimpleRegisteredLetterStep';
import { TimelineStepFactory } from '../TimelineStepFactory';

describe('TimelineStepFactory', () => {
  const mockStep = mockTimelineStepSendDigitalFeedback.step;
  const setStepCategory = (category: TimelineCategory) => {
    let step = _.cloneDeep(mockStep);
    step.category = category;
    return step;
  };

  const arrayCategories = [
    TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW,
    TimelineCategory.ANALOG_FAILURE_WORKFLOW,
    TimelineCategory.SEND_COURTESY_MESSAGE,
    TimelineCategory.SEND_DIGITAL_DOMICILE,
    TimelineCategory.SEND_DIGITAL_FEEDBACK,
    TimelineCategory.SEND_DIGITAL_PROGRESS,
    TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
    TimelineCategory.SEND_ANALOG_DOMICILE,
    TimelineCategory.SEND_ANALOG_FEEDBACK,
    TimelineCategory.SEND_ANALOG_PROGRESS,
    TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS,
    TimelineCategory.NOT_HANDLED,
  ];

  const arrayClasses = [
    ScheduleDigitalWorkflowStep,
    AnalogFailureWorkflowStep,
    SendCourtesyMessageStep,
    SendDigitalDomicileStep,
    SendDigitalFeedbackStep,
    SendDigitalProgressStep,
    SendSimpleRegisteredLetterStep,
    SendAnalogDomicileStep,
    SendAnalogFlowStep,
    SendAnalogFlowStep,
    SendAnalogFlowStep,
    NotHandledStep,
  ];

  arrayCategories.forEach((category, index) => {
    const currentClass = TimelineStepFactory.createTimelineStep(setStepCategory(category));
    it(`test return instance of ${currentClass.constructor.name} with category ${category}`, () => {
      expect(currentClass).toBeInstanceOf(arrayClasses[index]);
    });
  });

  it('test return instance of DefaultStep with a not handled category', () => {
    const currentClass = TimelineStepFactory.createTimelineStep(
      setStepCategory(TimelineCategory.REFINEMENT)
    );
    expect(currentClass).toBeInstanceOf(DefaultStep);
  });
});
