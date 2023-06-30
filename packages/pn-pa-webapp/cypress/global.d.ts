/// <reference types="cypress" />

import { PNRole } from "../src/models/user";

export type PaymentMethodType = 'pagoPA' | 'pagoPA_F24_FlatRate' | 'pagoPA_F24_Standard' | 'none';

export interface PreliminaryInfoFormData {
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  taxonomyCode: string;
  communicationType: 'Model_890' | 'A/R';
  paymentMethod: PaymentMethodType;
}

export interface RecipientFormData {
  position: number;
  data: {
    firstname: string;
    lastname: string;
    taxId: string;
    creditorTaxId?: string;
    noticeCode?: string;
    address: string;
    houseNumber: string;
    municipality: string;
    province: string;
    zip: string;
    foreignState: string;
  }
}