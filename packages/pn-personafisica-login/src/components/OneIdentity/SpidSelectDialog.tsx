import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { Button, Dialog, DialogContent, Grid, IconButton, Link, Typography } from '@mui/material';

import SpidBig from '../../assets/spid_big.svg';
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

  return (
    <Dialog
      open={show}
      fullScreen
      aria-labelledby="spid-select"
      transitionDuration={0}
      onClose={onClose}
    >
      <DialogContent sx={{ p: 0 }}>
        <Grid
          container
          direction="column"
          id="spidSelect"
          justifyContent="center"
          alignItems="center"
        >
          <Grid container direction="row" justifyContent="space-around" mt={3}>
            <Grid item xs={1}>
              <img src={SpidBig} aria-hidden />
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'right' }}>
              <IconButton
                color="primary"
                onClick={onClose}
                id="backIcon"
                aria-label={t('button.close', { ns: 'common' })}
              >
                <ClearOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item>
            <Typography
              id="spid-select"
              color="textPrimary"
              variant="h3"
              component="h1"
              sx={{ textAlign: 'center', py: 5, px: 0 }}
            >
              {t('spidSelect.title')}
            </Typography>
          </Grid>

          <SpidList
            idps={IDPS}
            loading={loading}
            authorizingEntityId={authorizingEntityId}
            onSelect={handleSelectIDP}
          />

          <Grid item>
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
            <Button
              type="submit"
              variant="outlined"
              id="backButton"
              sx={{
                borderRadius: '4px',
                width: '328px',
                height: '50px',
              }}
              onClick={onClose}
            >
              {t('spidSelect.cancelButton')}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default OneIdentitySpidSelectDialog;
