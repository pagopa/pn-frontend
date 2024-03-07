export type ProfilePropertyParams = {
  SEND_APPIO_STATUS: 'nd' | 'activated' | 'deactivated';
  SEND_HAS_PEC: 'yes' | 'no';
  SEND_HAS_EMAIL: 'yes' | 'no';
  SEND_HAS_SMS: 'yes' | 'no';
  SEND_HAS_MANDATE: 'yes' | 'no';
  SEND_MANDATE_GIVEN: 'yes' | 'no';
  SEND_PAYMENTS_COUNT: number;
};
