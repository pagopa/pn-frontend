import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';
import { Link, Stack, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

type ApiErrorProps = {
  onClick?: () => void;
  mt?: number;
  mainText?: string;
  apiId?: string;
  customErrorComponent?: React.ReactNode;
  children?: React.ReactNode;
};

const ApiError: React.FC<ApiErrorProps> = ({
  onClick,
  mt = 0,
  mainText,
  apiId,
  customErrorComponent,
}) => {
  if (customErrorComponent) {
    return <>{customErrorComponent}</>;
  }
  const dataTestId = `api-error${apiId ? `-${apiId}` : ''}`;
  const text =
    mainText ||
    getLocalizedOrDefaultLabel(
      'common',
      `messages.generic-api-error-main-text`,
      'Non siamo riusciti a recuperare questi dati.'
    );
  const actionLaunchText = getLocalizedOrDefaultLabel(
    'common',
    `messages.generic-api-error-action-text`,
    'Ricarica'
  );

  return (
    <Stack
      sx={(theme) => ({
        fontSize: '16px',
        mt,
        borderRadius: '4px',
        backgroundColor: theme.palette.background.paper,
        p: 2,
      })}
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      data-testid={dataTestId}
    >
      <ReportGmailerrorredRoundedIcon
        fontSize={'small'}
        sx={{ verticalAlign: 'middle', margin: '0 20px' }}
      />
      <Typography sx={{ marginRight: '8px' }}>{text}</Typography>
      <Link
        color="primary"
        fontWeight="bold"
        component="button"
        sx={{ cursor: 'pointer', textDecoration: 'underline', verticalAlign: 'inherit' }}
        onClick={onClick || (() => window.location.reload())}
      >
        {actionLaunchText}
      </Link>
    </Stack>
  );
};

export default ApiError;
