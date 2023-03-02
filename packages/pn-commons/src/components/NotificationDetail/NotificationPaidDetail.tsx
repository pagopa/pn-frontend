import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { PaidDetails } from "../../types";
import { getLocalizedOrDefaultLabel } from "../../services/localization.service";
import { formatEurocentToCurrency, formatFiscalCode } from "../../utils";
import CustomTableRow from "../CustomTableRow";

const NotificationPaidDetail = ({ paidDetailsList }: { paidDetailsList: Array<PaidDetails> }) =>
  <>
    {paidDetailsList.map((paidEventDetails: PaidDetails, index: number) => (
      <TableContainer
        key={index}
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
            {paidEventDetails.paymentObject && <CustomTableRow
                label={getLocalizedOrDefaultLabel(
                  'notifiche',
                  'detail.payment.object',
                  'Oggetto del pagamento'
                )}
                value={paidEventDetails.paymentObject}
              />
            }
            {paidEventDetails.amount &&
              <CustomTableRow
                label={getLocalizedOrDefaultLabel(
                  'notifiche',
                  'detail.payment.amount',
                  'Importo')}
                value={formatEurocentToCurrency(paidEventDetails.amount)}
              />
            }
            <CustomTableRow
              label={getLocalizedOrDefaultLabel(
                'notifiche',
                'detail.payment.type',
                'Tipologia di pagamento'
              )}
              value={paidEventDetails.paymentSourceChannel}
            />
            {paidEventDetails.noticeCode &&
              <CustomTableRow
                label={getLocalizedOrDefaultLabel(
                    'notifiche',
                    'detail.notice-code',
                    'Codice Avviso'
                  )}
                value={paidEventDetails.noticeCode.match(/.{1,4}/g)?.join(' ')}
              />
            }
            {paidEventDetails.creditorTaxId &&
              <CustomTableRow
                label={getLocalizedOrDefaultLabel(
                  'notifiche',
                  'detail.creditor-tax-id',
                  'Codice Fiscale Ente'
                )}
                value={formatFiscalCode(paidEventDetails.creditorTaxId)}
              />
            }
          </TableBody>
        </Table>
      </TableContainer>
    ))}
  </>;

export default NotificationPaidDetail;