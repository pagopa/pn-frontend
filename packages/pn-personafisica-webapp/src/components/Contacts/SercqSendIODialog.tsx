import { Trans, useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import {
  IllusAppIODialog,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { enableIOAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

type Props = {
  open: boolean;
  onDiscard: () => void;
};

const SercqSendIODialog: React.FC<Props> = ({ open, onDiscard }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  const sercqSendIoList: Array<string> = t('legal-contacts.sercq-send-io-list', {
    defaultValue: [],
    ns: 'recapiti',
  });

  const handleConfirm = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_START);
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION);
    dispatch(enableIOAddress())
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS, true);
        onDiscard();
      })
      .catch(() => {});
  };

  return (
    <PnDialog
      open={open}
      onClose={onDiscard}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="sercqSendIODialog"
    >
      <DialogTitle id="dialog-title">
        {t('legal-contacts.sercq-send-io-title', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description">
          <Trans i18nKey="legal-contacts.sercq-send-io-description" ns="recapiti" />
        </DialogContentText>
        <Stack direction="row" sx={{ mt: 3 }}>
          <Box>
            <Typography
              mb={2}
              sx={{ textTransform: 'uppercase' }}
              fontWeight={700}
              variant="subtitle2"
              color="text.secondary"
            >
              {t('legal-contacts.sercq-send-io-advantages', { ns: 'recapiti' })}
            </Typography>
            <List dense sx={{ p: 0, mx: 3, listStyleType: 'square' }}>
              {sercqSendIoList.map((item, index) => (
                <ListItem key={index} sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText disableTypography>
                    <Typography variant="body2" fontSize="18px">
                      <Trans i18nKey={item} t={(s: string) => s} />
                    </Typography>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
          {!isMobile && <IllusAppIODialog />}
        </Stack>
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={onDiscard} variant="naked">
          {t('button.not-now')}
        </Button>
        <Button onClick={handleConfirm} variant="contained" autoFocus>
          {t('button.attiva')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default SercqSendIODialog;
