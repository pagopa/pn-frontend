import { Trans, useTranslation } from 'react-i18next';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SavingsIcon from '@mui/icons-material/Savings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Button,
  DialogContentText,
  DialogTitle,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  PRIVACY_LINK_RELATIVE_PATH,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  TOS_LINK_RELATIVE_PATH,
} from '@pagopa-pn/pn-commons';

type Props = {
  open: boolean;
  onDiscard: () => void;
  onConfirm: () => void;
};

const SercqSendInfoIcons = [
  <VerifiedUserIcon key="verified" color="primary" />,
  <InsertDriveFileIcon key="insert" color="primary" />,
  <SavingsIcon key="savings" color="primary" />,
];

const redirectPrivacyLink = () => window.open(`${PRIVACY_LINK_RELATIVE_PATH}`, '_blank');
const redirectToSLink = () => window.open(`${TOS_LINK_RELATIVE_PATH}`, '_blank');

const SercqSendInfoDialog: React.FC<Props> = ({ open = false, onDiscard, onConfirm }) => {
  const { t } = useTranslation();

  const sercqSendInfoList: Array<string> = t('legal-contacts.sercq-send-info-list', {
    returnObjects: true,
    defaultValue: [],
    ns: 'recapiti',
  });

  return (
    <PnDialog
      open={open}
      data-testid="sercqSendInfoDialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        {t('legal-contacts.sercq-send-active', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description" sx={{ color: 'text.primary' }}>
          <Trans i18nKey="legal-contacts.sercq-send-info-description" ns="recapiti" />
        </DialogContentText>
        <List dense sx={{ p: 0, mt: 2 }}>
          {sercqSendInfoList.map((item, index) => (
            <ListItem key={index} sx={{ px: 0, py: 1 }}>
              <ListItemIcon>{SercqSendInfoIcons[index]}</ListItemIcon>
              <ListItemText disableTypography sx={{ fontWeight: 400, fontSize: '18px' }}>
                <Trans i18nKey={item} t={(s: string) => s} />
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Typography fontWeight={400} fontSize="14px" mt={3}>
          {t('legal-contacts.sercq-send-info-pec-disclaimer', { ns: 'recapiti' })}
        </Typography>
        <Typography fontWeight={400} fontSize="14px" mt={2}>
          <Trans
            i18nKey="legal-contacts.sercq-send-info-tos-privacy"
            ns="recapiti"
            components={[
              <Link
                key="tos"
                sx={{ cursor: 'pointer', textDecoration: 'none !important', fontWeight: 'bold' }}
                onClick={redirectToSLink}
                data-testid="tos-link"
              />,
              <Link
                key="privacy"
                sx={{ cursor: 'pointer', textDecoration: 'none !important', fontWeight: 'bold' }}
                onClick={redirectPrivacyLink}
                data-testid="privacy-link"
              />,
            ]}
          />
        </Typography>
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={onDiscard} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button onClick={onConfirm} variant="contained">
          {t('button.enable')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default SercqSendInfoDialog;
