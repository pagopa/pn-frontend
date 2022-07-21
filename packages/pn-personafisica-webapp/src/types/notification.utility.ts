export interface UserForParseNotificationDetailForRecipient {
  fiscal_number: string;
}

export type DelegatorsForParseNotificationDetailForRecipient = Array<{
  mandateId?: string;
  delegator?: { fiscalCode: string } | null;
}>;
