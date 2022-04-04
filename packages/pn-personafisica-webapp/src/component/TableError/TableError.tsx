import { Stack, styled, Typography } from '@mui/material';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { useTranslation } from 'react-i18next';

type TableErrorProps = {
  onClick: () => void;
};

const StyledStack = styled(Stack)`
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
`;

const TableError: React.FC<TableErrorProps> = ({ onClick }) => {
  const { t } = useTranslation(['deleghe']);

  return (
    <StyledStack
      sx={{ fontSize: '16px' }}
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <ReportGmailerrorredIcon
        fontSize={'small'}
        sx={{ verticalAlign: 'middle', margin: '0 20px' }}
      />
      <Typography sx={{ marginRight: '8px' }}>{t('deleghe.error')}</Typography>
      <Typography color="primary" fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={onClick}>
        {t('deleghe.reload')}
      </Typography>
    </StyledStack>
  );
};

export default TableError;
