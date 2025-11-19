import * as yup from 'yup';

import { IUN_regex } from '../utility/iun.utility';
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

const attachmentSchema: yup.SchemaOf<Attachment> = yup
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
  })
  .default(undefined)
  .noUnknown(true);

const f24Schema: yup.SchemaOf<F24PaymentDetails> = yup
  .object()
  .shape({
    title: yup.string().required(),
    applyCost: yup.boolean().required(),
    recIndex: yup.number(),
    attachmentIdx: yup.number(),
    metadataAttachment: attachmentSchema,
  })
  .default(undefined)
  .noUnknown(true);

const notificationDetailDocumentSchema: yup.SchemaOf<NotificationDetailDocument> = attachmentSchema
  .concat(
    yup.object().shape({
      title: yup.string().optional(),
      requiresAck: yup.boolean().optional(),
      docIdx: yup.string().optional(),
      documentId: yup.string().optional(),
      documentType: yup.string().optional(),
      recIndex: yup.number().optional(),
    })
  )
  .noUnknown(true);

const pagoPaSchema: yup.SchemaOf<PagoPAPaymentFullDetails> = yup
  .object()
  .shape({
    creditorTaxId: yup.string().required(),
    noticeCode: yup.string().required(),
    applyCost: yup.boolean().required(),
    status: yup.mixed().oneOf(Object.values(PaymentStatus)).required(),
    recipientType: yup.mixed().oneOf(Object.values(RecipientType)).optional(),
    paymentSourceChannel: yup.string().optional(),
    attachmentIdx: yup.number(),
    attachment: notificationDetailDocumentSchema.optional(),
    amount: yup.number().optional(),
    causaleVersamento: yup.string().optional(),
    dueDate: yup.string().optional(),
    detail: yup.mixed().oneOf(Object.values(PaymentInfoDetail)).optional(),
    detail_v2: yup.string().optional(),
    errorCode: yup.string().optional(),
    recIndex: yup.number().optional(),
    uncertainPaymentDate: yup.boolean().optional(),
    eventTimestamp: yup.string().optional(),
    notRefinedRecipientIndexes: yup.array().of(yup.number()).optional(),
  })
  .noUnknown(true);

const pagoPaF24Schema: yup.SchemaOf<PaymentDetails> = yup
  .object()
  .shape({
    pagoPa: pagoPaSchema.optional(),
    f24: f24Schema.optional(),
    isLoading: yup.boolean().optional(),
  })
  .noUnknown(true);

export const paymentCacheSchema: yup.SchemaOf<PaymentCache> = yup
  .object()
  .shape({
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
    payments: yup.array(pagoPaF24Schema).optional(),
  })
  .noUnknown(true);
