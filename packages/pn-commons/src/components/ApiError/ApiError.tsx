import { Stack, styled, Typography } from '@mui/material';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';

type ApiErrorProps = {
  onClick?: () => void;
  mt?: number;
  mainText?: string;
  apiId?: string;
};

const StyledStack = styled(Stack)`
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
`;

const ApiError: React.FC<ApiErrorProps> = ({ onClick, mt = 0, mainText, apiId }) => {
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
    <StyledStack
      sx={{ fontSize: '16px', mt }}
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      data-testid={`api-error${apiId ? `-${apiId}` : ''}`}
    >
      <ReportGmailerrorredIcon
        fontSize={'small'}
        sx={{ verticalAlign: 'middle', margin: '0 20px' }}
      />
      <Typography sx={{ marginRight: '8px' }}>{text}</Typography>
      <Typography
        color="primary"
        fontWeight="bold"
        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={onClick || (() => window.location.reload())}
      >
        {actionLaunchText}
      </Typography>
    </StyledStack>
  );
};

export default ApiError;
