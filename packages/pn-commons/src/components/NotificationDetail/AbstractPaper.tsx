import { useState } from 'react';

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { Avatar, Box, Divider, Grid, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { TitleBox, formatDate, getAccessibleIun, useIsMobile } from '@pagopa-pn/pn-commons';
import { getAccessibleDate } from '@pagopa-pn/pn-commons/src/utility/accessibility.utility';
import { MIPaper, Tag, theme } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

interface AbstractPaperProps {
  title?: string;
  senderPaId?: string;
  senderDenomination?: string;
  sentAt: string;
  iun: string;
  abstract?: string; // todo: to sanitize and format the abstract content before passing it to the component
}

const AbstractMIPaper = ({
  title,
  senderPaId,
  senderDenomination,
  sentAt,
  iun,
  abstract,
}: AbstractPaperProps) => {
  const isMobile = useIsMobile();
  const [hasError, setHasError] = useState(false);

  const borderTopStyle = `2px solid ${theme.palette.primary.main}`;

  return (
    <MIPaper
      padding={24}
      sx={{
        borderTop: borderTopStyle,
      }}
      borderRadius={8}
    >
      <Tag
        variant="default"
        icon={VerifiedRoundedIcon}
        value={getLocalizedOrDefaultLabel('notifications', 'detail.legal-value')}
      />
      <TitleBox variantTitle="h4" componentTitle="h1" title={title} sx={{ mt: 2 }} mbTitle={0} />
      <Divider aria-hidden sx={{ my: 2 }} />
      <Grid container>
        <Grid item xs={12} md={6} display="flex" alignItems="center" gap={2}>
          <Avatar
            alt={`${getLocalizedOrDefaultLabel('common', 'logo')} ${senderDenomination}`}
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
              {getAccessibleDate(sentAt)}
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
              {getLocalizedOrDefaultLabel('common', 'iun')}
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
    </MIPaper>
  );
};

export default AbstractMIPaper;
