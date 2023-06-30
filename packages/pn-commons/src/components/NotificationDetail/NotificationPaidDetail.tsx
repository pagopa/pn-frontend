import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';

import { PaymentHistory } from '../../types';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { formatEurocentToCurrency, formatFiscalCode } from '../../utils';
import CustomTableRow from '../CustomTableRow';

type NotificationPaidDetailProps = {
  paymentDetailsList: Array<PaymentHistory> | undefined;
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
    sx={{ backgroundColor: 'background.default', p: 3 }}
    data-testid="paymentTable"
  >
    <Table
      aria-label={getLocalizedOrDefaultLabel(
        'notifiche',
        'detail.payment-table-aria-label',
        'Dettaglio pagamenti'
      )}
    >
      <TableBody>
        {showRecipientType && paymentDetails.recipientType && (
          <CustomTableRow
            label={getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.payment.recipient-type',
              'Tipo di destinatario'
            )}
            dataTestId="recipientType"
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
                    'Persona giuridica'
                  )
            }
          />
        )}
        {paymentDetails.paymentObject && (
          <CustomTableRow
            label={getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.payment.object',
              'Oggetto del pagamento'
            )}
            value={paymentDetails.paymentObject}
            dataTestId="paymentObject"
          />
        )}
        {paymentDetails.amount && paymentDetails.amount !== 0 ? (
          <CustomTableRow
            label={getLocalizedOrDefaultLabel('notifiche', 'detail.payment.amount', 'Importo')}
            value={formatEurocentToCurrency(paymentDetails.amount)}
            dataTestId="amount"
          />
        ) : null}
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
          dataTestId="paymentType"
        />
        {paymentDetails.noticeCode && (
          <CustomTableRow
            label={getLocalizedOrDefaultLabel('notifiche', 'detail.notice-code', 'Codice Avviso')}
            value={paymentDetails.noticeCode.match(/.{1,4}/g)?.join(' ')}
            dataTestId="noticeCode"
          />
        )}
        {paymentDetails.creditorTaxId && (
          <CustomTableRow
            label={getLocalizedOrDefaultLabel(
              'notifiche',
              'detail.creditor-tax-id',
              'Codice Fiscale Ente'
            )}
            value={formatFiscalCode(paymentDetails.creditorTaxId)}
            dataTestId="creditorTaxId"
          />
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const NotificationPaidDetail = ({ paymentDetailsList, isSender }: NotificationPaidDetailProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      {paymentDetailsList && paymentDetailsList.length === 1 && (
        <Box mt={2}>
          {isSender && (
            <Typography fontSize="16px" fontWeight={600} data-testid="paymentRecipient" mb={2}>
              {paymentDetailsList[0].recipientDenomination} - {paymentDetailsList[0].recipientTaxId}
            </Typography>
          )}
          <PaymentTable paymentDetails={paymentDetailsList[0]} showRecipientType={isSender} />
        </Box>
      )}
      {paymentDetailsList &&
        paymentDetailsList.length > 1 &&
        paymentDetailsList.map((paymentEventDetails: PaymentHistory, index: number) =>
          isSender ? (
            <Accordion
              key={index}
              expanded={expanded === `panel-${index}`}
              onChange={handleChange(`panel-${index}`)}
              disableGutters
              data-testid="paymentAccordion"
            >
              <AccordionSummary
                expandIcon={
                  expanded === `panel-${index}` ? (
                    <UnfoldLessIcon color="primary" />
                  ) : (
                    <UnfoldMoreIcon color="primary" />
                  )
                }
              >
                <Box
                  width="100%"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontSize="16px" fontWeight="600" data-testid="recipient">
                    {paymentEventDetails.recipientDenomination} -{' '}
                    {paymentEventDetails.recipientTaxId}
                  </Typography>
                  <Typography fontSize="14px" fontWeight="600" color="primary">
                    {getLocalizedOrDefaultLabel(
                      'notifiche',
                      'payment.show-more',
                      'Mostra dettagli'
                    )}
                  </Typography>
                </Box>
              </AccordionSummary>
              <PaymentTable paymentDetails={paymentEventDetails} showRecipientType />
            </Accordion>
          ) : (
            <PaymentTable key={index} paymentDetails={paymentEventDetails} />
          )
        )}
    </>
  );
};

export default NotificationPaidDetail;
