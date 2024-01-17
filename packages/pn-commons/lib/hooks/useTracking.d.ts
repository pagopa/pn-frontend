/**
 * React hook that sets up Mixpanel tracking based on OneTrust consent settings.
 * It listens for changes in OneTrust consent and checks for the presence of a
 * specific cookie value to determine whether to initialize Mixpanel tracking.
 * @param {string} mixpanelToken:string
 * @param {string} nodeEnv:string
 */
export declare function useTracking(mixpanelToken: string, nodeEnv: string): void;
