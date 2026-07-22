import { useState } from 'react';

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { Avatar, Box, Divider, Grid, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { MIPaper, Tag, theme } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { formatDate } from '../../utility';
import { getAccessibleIun } from '../../utility/accessibility.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PNMarkdown from '../PnMarkdown/PnMarkdown';
import TitleBox from '../TitleBox';

interface AbstractPaperProps {
  title?: string;
  senderPaId?: string;
  senderDenomination?: string;
  iun: string;
  abstract?: string; // todo: to sanitize and format the abstract content before passing it to the component
  isLegal?: boolean;
  filedAt: string;
  senderLogoUrl?: string;
}

interface InstitutionLogoProps {
  id?: string;
  name?: string;
  senderLogoUrl?: string;
}

const InstitutionLogo = ({ id, name, senderLogoUrl }: InstitutionLogoProps) => {
  const [hasError, setHasError] = useState(false);

  const logoSrc =
    id && !hasError && senderLogoUrl ? `${senderLogoUrl}${id}/institutions/logo.png` : undefined;

  return (
    <Avatar
      src={logoSrc}
      alt={`${getLocalizedOrDefaultLabel('common', 'logo')} ${name}`}
      imgProps={{
        onError: () => setHasError(true),
      }}
      sx={{
        width: { xs: 40, md: 56 },
        height: { xs: 40, md: 56 },
        backgroundColor: theme.palette.grey[50],
      }}
      variant="rounded"
    >
      <AccountBalanceOutlinedIcon sx={{ color: theme.palette.grey[300] }} />
    </Avatar>
  );
};
const AbstractPaper = ({
  title,
  senderPaId,
  senderDenomination,
  iun,
  abstract,
  isLegal = true,
  filedAt,
  senderLogoUrl,
}: AbstractPaperProps) => {
  const isMobile = useIsMobile();

  return (
    <MIPaper
      padding={24}
      sx={{
        ...(isLegal && {
          borderTop: `2px solid ${theme.palette.primary.main}`,
        }),
      }}
    >
      {isLegal && (
        <Tag
          variant="default"
          icon={VerifiedRoundedIcon}
          value={getLocalizedOrDefaultLabel('notifications', 'detail.legal-value')}
        />
      )}
      <TitleBox variantTitle="h4" componentTitle="h1" title={title} sx={{ mt: 2 }} mbTitle={0} />
      <Divider aria-hidden sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} display="flex" alignItems="center" gap={2}>
          <InstitutionLogo
            id={senderPaId}
            name={senderDenomination}
            senderLogoUrl={senderLogoUrl}
          />
          <Box>
            <Typography variant="sidenav" color="text">
              {senderDenomination}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLegal
                ? getLocalizedOrDefaultLabel('notifications', 'detail.legal-date')
                : getLocalizedOrDefaultLabel('notifications', 'detail.informal-date')}{' '}
              {formatDate(filedAt, false)}
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
      {isLegal ? (
        <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
          {abstract}
        </Typography>
      ) : (
        <Box sx={{ overflowWrap: 'anywhere' }}>
          <PNMarkdown content={abstract ?? ''} />
        </Box>
      )}
      {isLegal && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {getLocalizedOrDefaultLabel('notifications', 'detail.legal-disclaimer')}
        </Typography>
      )}
    </MIPaper>
  );
};

export default AbstractPaper;
