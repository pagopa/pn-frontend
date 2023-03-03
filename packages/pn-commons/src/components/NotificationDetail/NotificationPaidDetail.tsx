import { Accordion, AccordionSummary, Box, Paper, Table, TableBody, TableContainer, Typography } from "@mui/material";
import { PaymentHistory } from "../../types";
import { getLocalizedOrDefaultLabel } from "../../services/localization.service";
import { formatEurocentToCurrency, formatFiscalCode } from "../../utils";
import CustomTableRow from "../CustomTableRow";

type NotificationPaidDetailProps = {
  paymentDetailsList: Array<PaymentHistory>;
  isSender?: boolean;
};

type PaymentTableProps = {
  paymentDetails: PaymentHistory;
  showRecipientType?: boolean;
};

const PaymentTable = ({ paymentDetails, showRecipientType }: PaymentTableProps) => (
  <TableContainer
    component={Paper}
    className="paperContainer"
    sx={{ backgroundColor: "background.default", p: 3 }}
  >
    <Table aria-label={
      getLocalizedOrDefaultLabel(
        'notifiche',
        'detail.table-aria-label',
        'Dettaglio notifica'
      )}>
      <TableBody>
        {showRecipientType && paymentDetails.recipientType && <CustomTableRow
          label={getLocalizedOrDefaultLabel(
            'notifiche',
            'detail.payment.recipient-type',
            'Tipo di destinatario'
          )}
          value={
          paymentDetails.recipientType === 'PF'
            ? getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.payment.natural-person',
              'Persona fisica'
            )
            : getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.payment.legal-person',
              'persona-giuridica'
            )
          }
        />
        }
        {paymentDetails.paymentObject && <CustomTableRow
          label={getLocalizedOrDefaultLabel(
            'notifiche',
            'detail.payment.object',
            'Oggetto del pagamento'
          )}
          value={paymentDetails.paymentObject}
        />
        }
        {paymentDetails.amount &&
          <CustomTableRow
            label={getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.payment.amount',
              'Importo')}
            value={formatEurocentToCurrency(paymentDetails.amount)}
          />
        }
        {paymentDetails.amount &&
          <CustomTableRow
            label={getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.payment.amount',
              'Importo')}
            value={formatEurocentToCurrency(paymentDetails.amount)}
          />
        }
        <CustomTableRow
          label={getLocalizedOrDefaultLabel(
            'notifiche',
            'detail.payment.type',
            'Tipologia di pagamento'
          )}
          value={
          paymentDetails.idF24
            ? 'F24'
            : getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.payment.pagopa-notice',
              'Avviso pagoPA'
            )
        }
        />
        {paymentDetails.noticeCode &&
          <CustomTableRow
            label={getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.notice-code',
              'Codice Avviso'
            )}
            value={paymentDetails.noticeCode.match(/.{1,4}/g)?.join(' ')}
          />
        }
        {paymentDetails.creditorTaxId &&
          <CustomTableRow
            label={getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.creditor-tax-id',
              'Codice Fiscale Ente'
            )}
            value={formatFiscalCode(paymentDetails.creditorTaxId)}
          />
        }
      </TableBody>
    </Table>
  </TableContainer>
);

const NotificationPaidDetail = ({ paymentDetailsList, isSender }: NotificationPaidDetailProps ) =>
  <>
    {paymentDetailsList.length === 1 && (
      <Box>
        {isSender &&
          <Typography fontWeight={600}>
            {paymentDetailsList[0].recipientDenomination} - {paymentDetailsList[0].recipientTaxId}
          </Typography>}
        <PaymentTable  paymentDetails={paymentDetailsList[0]} showRecipientType={isSender} />
      </Box>
    )}
    {paymentDetailsList.length > 1 &&
      paymentDetailsList.map((paymentEventDetails: PaymentHistory, index: number) => (
        isSender ? (
            <Accordion key={index}>
              <AccordionSummary

              >
                <Typography>
                  {paymentEventDetails}
                </Typography>
              </AccordionSummary>
              <PaymentTable paymentDetails={paymentEventDetails} showRecipientType />
            </Accordion>
          ) : (
            <PaymentTable key={index} paymentDetails={paymentEventDetails} />
          )
    ))}
  </>;

export default NotificationPaidDetail;