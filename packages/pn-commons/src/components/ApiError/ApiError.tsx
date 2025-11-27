import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Link, Stack, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

type ApiErrorProps = {
  onClick?: () => void;
  mt?: number;
  mainText?: string;
  apiId?: string;
  children?: React.ReactNode;
};

const ApiError: React.FC<ApiErrorProps> = ({ onClick, mt = 0, mainText, apiId }) => {
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
      sx={{ fontSize: '16px', mt, borderRadius: '4px', backgroundColor: '#ffffff', p: 2 }}
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      data-testid={dataTestId}
    >
      <ReportGmailerrorredIcon
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
