import { useCallback, useMemo, useState } from 'react';

enum GENERAL_STEPS {
  NOT_STARTED = 'NotStarted',
}

/**
 * A custom hook that helps handle a process involving several steps,
 * where we can define a separate useEffect block for each step.
 *
 * The type parameter is the type of the step, ideally an enum.
 *
 * To be used like this
 *
 * enum STEPS = { STEP_1 = "Step1", STEP_2 = "Step2", STEP_3 = "Step3" };
 *
 * const Component = () => {
 *
 *   const { performStep, isFinished } = useProcess([STEPS.STEP_1, STEPS.STEP_2, STEPS.STEP_3]);
 *
 *   useEffect(() => {
 *     performStep(STEPS.STEP_1, async () => { ... async action for first step ... });
 *   }, [performStep]);
 *
 *   useEffect(() => {
 *     performStep(STEPS.STEP_2, async () => { ... async action for second step ... });
 *   }, [performStep]);
 *
 *   useEffect(() => {
 *     performStep(STEPS.STEP_3, () => { ... non-async action for third step ... });
 *   }, [performStep]);
 *
 *   return isFinished() ? ...real stuff... : <div>initializing ...</div>;
 * }
 *
 * The dependency on performStep should suffice, since the definition of performStep depends in turn
 * on the current status of the process, and hence the useEffect blocks will be recomputed each time
 * such status changes, namely at the beginning and at the end of each step.
 *
 * The startStep / endCurrentStep / mustProceedToStep functions allow to manually control the perform of a step.
 */
export function useProcess<T>(sequence: Array<T>) {
  type STEP_TYPE = T | GENERAL_STEPS;

  const fullSequence: Array<STEP_TYPE> = useMemo(
    () => [GENERAL_STEPS.NOT_STARTED, ...sequence],
    [sequence]
  );

  const [currentSituation, setCurrentSituation] = useState<{ step: STEP_TYPE; isActive: boolean }>({
    step: GENERAL_STEPS.NOT_STARTED,
    isActive: false,
  });

  const mustProceedToStep = useCallback(
    (step: STEP_TYPE) =>
      fullSequence.indexOf(currentSituation.step) === fullSequence.indexOf(step) - 1 &&
      !currentSituation.isActive,
    [currentSituation]
  );

  const isFinished = useCallback(
    () =>
      fullSequence.indexOf(currentSituation.step) === fullSequence.length - 1 &&
      !currentSituation.isActive,
    [currentSituation]
  );

  const startStep = useCallback((step: STEP_TYPE) => {
    setCurrentSituation({ step, isActive: true });
  }, []);

  const endCurrentStep = useCallback(() => {
    setCurrentSituation((currentValue) => {
      if (currentValue.isActive === false) {
        return currentValue;
      }
      return { ...currentValue, isActive: false };
    });
  }, []);

  const performStep = useCallback(
    async (step: T, action: () => Promise<void> | void) => {
      if (mustProceedToStep(step)) {
        startStep(step);
        await action();
        endCurrentStep();
      }
    },
    [mustProceedToStep, startStep, endCurrentStep]
  );

  return {
    mustProceedToStep,
    isFinished,
    startStep,
    endCurrentStep,
    performStep,
    currentSituation,
  };
}
