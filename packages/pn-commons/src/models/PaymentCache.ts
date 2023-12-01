import * as yup from 'yup';

import { IUN_regex } from '../utility';
import {
  Attachment,
  F24PaymentDetails,
  NotificationDetailDocument,
  PagoPAPaymentFullDetails,
  PaymentDetails,
  PaymentInfoDetail,
  PaymentStatus,
  RecipientType,
} from './NotificationDetail';

export type PaymentCache = {
  iun: string;
  timestamp: string;
  currentPayment?: {
    noticeCode: string;
    creditorTaxId: string;
  };
  currentPaymentPage?: number;
  payments: Array<PaymentDetails>;
};

const attachmentSchema: yup.SchemaOf<Attachment> = yup.object().shape({
  digests: yup.object().shape({
    sha256: yup.string().required(),
  }),
  contentType: yup.string().required(),
  ref: yup.object().shape({
    key: yup.string().required(),
    versionToken: yup.string().required(),
  }),
});

const f24Schema: yup.SchemaOf<F24PaymentDetails> = yup
  .object()
  .shape({
    title: yup.string().required(),
    applyCost: yup.boolean().required(),
    recIndex: yup.number(),
    attachmentIdx: yup.number(),
    metadataAttachment: attachmentSchema,
  })
  .default(undefined);

// todo check how to extends attachmentSchema
const notificationDetailDocumentSchema: yup.SchemaOf<NotificationDetailDocument> = yup
  .object()
  .shape({
    digests: yup.object().shape({
      sha256: yup.string().required(),
    }),
    contentType: yup.string().required(),
    ref: yup.object().shape({
      key: yup.string().required(),
      versionToken: yup.string().required(),
    }),
    title: yup.string().optional(),
    requiresAck: yup.boolean().optional(),
    docIdx: yup.string().optional(),
    documentId: yup.string().optional(),
    documentType: yup.string().optional(),
    recIndex: yup.number().optional(),
  });

const pagoPaSchema: yup.SchemaOf<PagoPAPaymentFullDetails> = yup.object().shape({
  creditorTaxId: yup.string().required(),
  noticeCode: yup.string().required(),
  applyCost: yup.boolean().required(),
  status: yup.string().oneOf(Object.values(PaymentStatus)).not([undefined]),
  recipientType: yup.string().oneOf(Object.values(RecipientType)).not([undefined]),
  paymentSourceChannel: yup.string().not([undefined]),
  attachmentIdx: yup.number(),
  attachment: notificationDetailDocumentSchema.optional(),
  amount: yup.number().optional(),
  causaleVersamento: yup.string().optional(),
  dueDate: yup.string().optional(),
  detail: yup.string().optional().oneOf(Object.values(PaymentInfoDetail)).not([undefined]),
  detail_v2: yup.string().optional(),
  errorCode: yup.string().optional(),
  url: yup.string().optional(),
  recIndex: yup.number().optional(),
});

const pagoPaF24Schema: yup.SchemaOf<PaymentDetails> = yup.object().shape({
  pagoPa: pagoPaSchema.optional(),
  f24: f24Schema.optional(),
  isLoading: yup.boolean().optional(),
});

export const paymentCacheSchema: yup.SchemaOf<PaymentCache> = yup.object().shape({
  iun: yup.string().required().matches(IUN_regex),
  timestamp: yup.string().required(),
  currentPayment: yup
    .object()
    .shape({
      noticeCode: yup.string(),
      creditorTaxId: yup.string(),
    })
    .optional(),
  currentPaymentPage: yup.number().optional(),
  payments: yup.array(pagoPaF24Schema).required(),
});
