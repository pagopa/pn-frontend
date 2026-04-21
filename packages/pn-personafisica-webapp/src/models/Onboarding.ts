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
