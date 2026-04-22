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

export const OnboardingFlows = {
  DIGITAL_DOMICILE: 'digital_domicile',
  COURTESY: 'courtesy',
  IO: 'io',
};
export type OnboardingFlows = (typeof OnboardingFlows)[keyof typeof OnboardingFlows];

export type OnboardingFlow = 'onboarding';

export type ContactStatus = 'empty' | 'populated';
