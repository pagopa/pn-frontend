import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { Avatar, Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { TitleBox, formatDate, getAccessibleIun, useIsMobile } from '@pagopa-pn/pn-commons';
import { getAccessibleDate } from '@pagopa-pn/pn-commons/src/utility/accessibility.utility';
import { Tag } from '@pagopa/mui-italia';

interface AbstractPaperProps {
  title?: string;
  senderPaId?: string;
  senderDenomination?: string;
  sentAt: string;
  iun: string;
  abstract?: string;
  isLegal?: boolean;
}

const AbstractPaper = ({
  title,
  senderPaId,
  senderDenomination,
  sentAt,
  iun,
  abstract,
  isLegal = true,
}: AbstractPaperProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['common']);
  const [hasError, setHasError] = useState(false);

  return (
    <Paper
      sx={{
        p: 3,
        my: 3,
        borderTop: isLegal ? '2px solid var(--Color-Blue-Blue-500, #0B3EE3)' : undefined,
        borderRadius: '8px',
      }}
      elevation={0}
    >
      {isLegal && (
        <Tag variant="default" icon={VerifiedRoundedIcon} value="Comunicazione a valore legale" />
      )}
      <TitleBox
        variantTitle="h4"
        componentTitle="h1"
        title={title}
        sx={{ mt: isLegal ? 2 : 0 }}
        mbTitle={0}
      />
      <Divider aria-hidden sx={{ my: 2 }} />
      <Grid container>
        <Grid item xs={12} md={6} display="flex" alignItems="center" gap={2}>
          <Avatar
            alt={`${t('logo', { ns: 'common' })} ${senderDenomination}`}
            variant="rounded"
            src={
              hasError
                ? undefined
                : `https://selcucheckoutsa.z6.web.core.windows.net/institutions/${senderPaId}/logo.png`
            }
            onError={() => setHasError(true)}
            sx={{ bgcolor: '#f4f5f8', color: '#bbc2d6ff' }}
          >
            <AccountBalanceOutlinedIcon />
          </Avatar>
          <Box>
            <Typography variant="sidenav" color="text">
              {senderDenomination}
            </Typography>
            <Typography variant="body1" color="text.secondary" aria-hidden="true">
              {formatDate(sentAt)}
            </Typography>
            <Typography component="span" sx={{ ...visuallyHidden }}>
              {getAccessibleDate(sentAt, { t, ns: 'common' })}
            </Typography>
          </Box>
        </Grid>
        {isMobile && (
          <Grid item xs={12}>
            <Divider aria-hidden sx={{ my: 2 }} />
          </Grid>
        )}
        <Grid item xs={12} md={6} display="flex" alignItems="center" gap={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {t('iun', { ns: 'common' })}
            </Typography>
            <Typography variant="body2" color="text" fontWeight={600} aria-hidden="true">
              {iun}
            </Typography>
            <Typography component="span" sx={{ ...visuallyHidden }}>
              {getAccessibleIun(iun)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider aria-hidden sx={{ my: 2 }} />
      <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
        {abstract}
      </Typography>
    </Paper>
  );
};

export default AbstractPaper;
