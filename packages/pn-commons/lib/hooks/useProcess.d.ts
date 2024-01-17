declare enum GENERAL_STEPS {
    NOT_STARTED = "NotStarted"
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
export declare function useProcess<T>(sequence: Array<T>): {
    mustProceedToStep: (step: T | GENERAL_STEPS) => boolean;
    isFinished: () => boolean;
    startStep: (step: T | GENERAL_STEPS) => void;
    endCurrentStep: () => void;
    performStep: (step: T, action: () => Promise<void> | void) => Promise<void>;
    currentSituation: {
        step: T | GENERAL_STEPS;
        isActive: boolean;
    };
};
export {};
