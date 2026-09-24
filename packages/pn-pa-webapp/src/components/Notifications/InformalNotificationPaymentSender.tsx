import { useTranslation } from 'react-i18next';

import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { Grid, Typography } from '@mui/material';
import { PaymentAttachmentSName, appStateActions, downloadDocument } from '@pagopa-pn/pn-commons';
import { MIBoxedModule, MIButton, MIPaper } from '@pagopa/mui-italia';

import { InformalNotificationPaymentItem } from '../../generated-client/informal-notifications';
import { useAppDispatch } from '../../redux/hooks';
import { getSentInformalNotificationPayment } from '../../redux/notification/actions';

type Props = {
  iun: string;
  payment: InformalNotificationPaymentItem;
  recipientIdx: number;
};

const InformalNotificationPaymentSender: React.FC<Props> = ({ iun, payment, recipientIdx }) => {
  const { t } = useTranslation(['campaigns']);
  const dispatch = useAppDispatch();

  const downloadHandler = () => {
    void dispatch(
      getSentInformalNotificationPayment({
        iun,
        recipientIdx,
        attachmentName: PaymentAttachmentSName.PAGOPA,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.retryAfter) {
          dispatch(
            appStateActions.addInfo({
              title: '',
              message: t('informal.detail.documents.document-not-available'),
            })
          );
        } else if (response.url) {
          downloadDocument(response.url);
        }
      })
      .catch(() => {});
  };

  return (
    <MIPaper padding={24}>
      <Typography variant="h5" mb={2}>
        {t('informal.detail.payments.title')}
      </Typography>

      <MIBoxedModule>
        <MIButton
          variant="text"
          fullWidth
          onClick={downloadHandler}
          endIcon={<OpenInBrowserRoundedIcon />}
          sx={{
            justifyContent: 'space-between',
            '& .MuiButton-endIcon svg': {
              fontSize: '24px',
            },
          }}
        >
          <Grid container alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {t('informal.detail.payments.notice-code')}&nbsp;
            </Typography>

            <Typography variant="caption" fontWeight={600} color="text.primary">
              {payment.pagoPa.noticeCode}
            </Typography>
          </Grid>
        </MIButton>
      </MIBoxedModule>
    </MIPaper>
  );
};

export default InformalNotificationPaymentSender;
