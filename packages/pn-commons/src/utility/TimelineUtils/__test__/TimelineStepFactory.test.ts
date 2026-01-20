import { getTimelineElem } from '../../../__mocks__/NotificationDetail.mock';
import { TimelineCategory } from '../../../models/NotificationDetail';
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
  const arrayCategories = [
    { category: TimelineCategory.SCHEDULE_DIGITAL_WORKFLOW, class: ScheduleDigitalWorkflowStep },
    { category: TimelineCategory.ANALOG_FAILURE_WORKFLOW, class: AnalogFailureWorkflowStep },
    { category: TimelineCategory.SEND_COURTESY_MESSAGE, class: SendCourtesyMessageStep },
    { category: TimelineCategory.SEND_DIGITAL_DOMICILE, class: SendDigitalDomicileStep },
    { category: TimelineCategory.SEND_DIGITAL_FEEDBACK, class: SendDigitalFeedbackStep },
    { category: TimelineCategory.SEND_DIGITAL_PROGRESS, class: SendDigitalProgressStep },
    {
      category: TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER,
      class: SendSimpleRegisteredLetterStep,
    },
    { category: TimelineCategory.SEND_ANALOG_DOMICILE, class: SendAnalogDomicileStep },
    { category: TimelineCategory.SEND_ANALOG_FEEDBACK, class: SendAnalogFlowStep },
    { category: TimelineCategory.SEND_ANALOG_PROGRESS, class: SendAnalogFlowStep },
    {
      category: TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER_PROGRESS,
      class: SendAnalogFlowStep,
    },
    { category: TimelineCategory.NOT_HANDLED, class: NotHandledStep },
  ];

  it.each(arrayCategories)(
    `test return instance of $class.name with category $category`,
    (category) => {
      const currentStep = getTimelineElem(category.category, {});
      const currentClass = TimelineStepFactory.createTimelineStep(currentStep);
      expect(currentClass).toBeInstanceOf(category.class);
    }
  );

  it('test return instance of DefaultStep with a not handled category', () => {
    const currentStep = getTimelineElem(TimelineCategory.REFINEMENT, {});
    const currentClass = TimelineStepFactory.createTimelineStep(currentStep);
    expect(currentClass).toBeInstanceOf(DefaultStep);
  });
});
