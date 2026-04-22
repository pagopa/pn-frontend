import { IOAllowedValues } from './contacts';

export type WizardMode = 'send' | 'pec';

export type ContactValue = string | IOAllowedValues | undefined;

export type ContactState<TValue extends ContactValue = ContactValue> = {
  value: TValue;
  alreadySet: boolean;
};

export type EmailContactState = ContactState<string | undefined>;
export type PecContactState = ContactState<string | undefined> & { isValid?: boolean };
export type IoContactState = ContactState<IOAllowedValues | undefined>;
export type SmsContactState = ContactState<string | undefined>;

// --- Mixpanel ---
export const OnboardingSource = {
  NOTIFICATION_DETAIL: 'notification_detail',
  LOGIN: 'login',
} as const;
export type OnboardingSource = (typeof OnboardingSource)[keyof typeof OnboardingSource];

export const OnboardingAvailableFlows = {
  DIGITAL_DOMICILE: 'digital_domicile',
  COURTESY: 'courtesy',
  IO: 'io',
};
export type OnboardingAvailableFlows =
  (typeof OnboardingAvailableFlows)[keyof typeof OnboardingAvailableFlows];

export const TrackingFlow = {
  ONBOARDING: 'onboarding',
} as const;

export type TrackingFlow = (typeof TrackingFlow)[keyof typeof TrackingFlow];

export const OnboardingContactStatus = {
  EMPTY: 'empty',
  POPULATED: 'populated',
};
export type OnboardingContactStatus =
  (typeof OnboardingContactStatus)[keyof typeof OnboardingContactStatus];
