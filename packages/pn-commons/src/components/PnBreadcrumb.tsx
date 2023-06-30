import { ReactNode, RefAttributes } from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';
import { Breadcrumbs, Stack, styled, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonNaked } from '@pagopa/mui-italia';
import { getLocalizedOrDefaultLabel } from '../services/localization.service';

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: `${theme.palette.text.primary} !important`,
  textDecoration: 'none !important',
}));

const BreadcrumbLink = (props: LinkProps & RefAttributes<HTMLAnchorElement>) => (
  <StyledLink {...props} />
);

type PnBreadcrumbProps = {
  goBackAction?: () => void;
  goBackLabel?: string;
  showBackAction?: boolean; // set to false if you don't want the "back" ("Indietro") link to be included
  linkProps?: LinkProps & RefAttributes<HTMLAnchorElement>;
  linkRoute: string;
  linkLabel: ReactNode;
  currentLocationLabel: string;
};

const PnBreadcrumb = ({
  goBackAction,
  goBackLabel,
  showBackAction = true,
  linkProps,
  linkRoute,
  linkLabel,
  currentLocationLabel,
}: PnBreadcrumbProps) => {
  const navigate = useNavigate();

  const finalBackLabel =
    goBackLabel || getLocalizedOrDefaultLabel('common', 'button.indietro', 'Indietro');

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'start', sm: 'center' }}
      justifyContent="start"
      spacing={3}
    >
      {showBackAction && (
        <ButtonNaked
          color="primary"
          data-testid="breadcrumb-indietro-button"
          startIcon={<ArrowBackIcon />}
          onClick={goBackAction ? goBackAction : () => navigate(-1)}
        >
          {finalBackLabel}
        </ButtonNaked>
      )}
      <Breadcrumbs aria-label="breadcrumb">
        <BreadcrumbLink to={linkRoute} {...linkProps}>
          {linkLabel}
        </BreadcrumbLink>
        <Typography
          color="text.primary"
          fontWeight={600}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {currentLocationLabel}
        </Typography>
      </Breadcrumbs>
    </Stack>
  );
};

export default PnBreadcrumb;
