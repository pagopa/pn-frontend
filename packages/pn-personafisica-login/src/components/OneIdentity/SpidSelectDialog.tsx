import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { Dialog, DialogContent, IconButton, Link, Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';

import { IDP } from '../../models/IDPS';
import { getConfiguration } from '../../services/configuration.service';
import SpidList from './SpidList';

type Props = {
  show: boolean;
  IDPS: Array<IDP>;
  loading: boolean;
  authorizingEntityId: string | null;
  onClose: () => void;
  handleSelectIDP: (idp: IDP) => void;
};

const OneIdentitySpidSelectDialog: React.FC<Props> = ({
  show,
  IDPS,
  loading,
  authorizingEntityId,
  onClose,
  handleSelectIDP,
}) => {
  const { t } = useTranslation(['login']);
  const { SPID_REQUEST_LINK } = getConfiguration();
  const isMobile = useIsMobile('sm');

  return (
    <Dialog
      open={show}
      aria-labelledby="spid-select"
      fullScreen={isMobile}
      transitionDuration={0}
      onClose={onClose}
    >
      <DialogContent id="spidSelect" sx={{ p: 3, width: { xs: '100%', sm: '410px', lg: '600px' } }}>
        <Stack
          direction="row"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography
            id="spid-select"
            fontWeight="bold"
            fontSize={{ xs: '18px', sm: '24px', color: '#0E0F13' }}
          >
            {t('spidSelect.title')}
          </Typography>

          <IconButton
            onClick={onClose}
            id="backIcon"
            size="small"
            aria-label={t('button.close', { ns: 'common' })}
            sx={{ color: '#0E0F13' }}
          >
            <ClearOutlinedIcon />
          </IconButton>
        </Stack>

        <SpidList
          idps={IDPS}
          loading={loading}
          authorizingEntityId={authorizingEntityId}
          onSelect={handleSelectIDP}
        />

        <Typography
          color="textPrimary"
          variant="body2"
          sx={{
            fontSize: '14px',
            textAlign: 'center',
            py: 3,
            px: 0,
          }}
          component="div"
        >
          <Trans i18nKey="spidSelect.hintText" ns="login">
            <Link href={SPID_REQUEST_LINK} id="requestForSpid">
              {'spidSelect.hintText'}
            </Link>
          </Trans>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default OneIdentitySpidSelectDialog;
