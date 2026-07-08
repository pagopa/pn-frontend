import { useState } from 'react';

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { Avatar, Box, Divider, Grid, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { MIPaper, Tag, theme } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { formatDate } from '../../utility';
import { getAccessibleDate, getAccessibleIun } from '../../utility/accessibility.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PNMarkdown from '../PnMarkdown/PnMarkdown';
import TitleBox from '../TitleBox';

interface AbstractPaperProps {
  title?: string;
  senderPaId?: string;
  senderDenomination?: string;
  sentAt: string;
  iun: string;
  abstract?: string; // todo: to sanitize and format the abstract content before passing it to the component
  isLegal?: boolean;
}

interface InstitutionLogoProps {
  id?: string;
  name?: string;
}

const InstitutionLogo = ({ id, name }: InstitutionLogoProps) => {
  const [hasError, setHasError] = useState(false);

  const logoSrc =
    id && !hasError
      ? `https://selcucheckoutsa.z6.web.core.windows.net/institutions/${id}/logo.png`
      : undefined;

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
        backgroundColor: '#f4f5f8',
      }}
      variant="rounded"
    >
      <AccountBalanceOutlinedIcon sx={{ color: '#bbc2d6ff' }} />
    </Avatar>
  );
};
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
      <Grid container>
        <Grid item xs={12} md={6} display="flex" alignItems="center" gap={2}>
          <InstitutionLogo id={senderPaId} name={senderDenomination} />
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
      {abstract && <Divider aria-hidden sx={{ my: 2 }} />}
      <Box sx={{ overflowWrap: 'anywhere' }}>
        <PNMarkdown content={abstract ?? ''} />
      </Box>
    </MIPaper>
  );
};

export default AbstractPaper;
