import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Delegation } from '../../../redux/delegation/types';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../../utils/status.utility';
import { AcceptButton, Menu } from './delegationsColumns';

interface DelegationCardProps {
  delegation: Delegation;
  type: 'delegates' | 'delegators';
}

const DelegationCard = ({ delegation, type }: DelegationCardProps) => {
  const { t } = useTranslation(['deleghe']);
  const { label, color } = getDelegationStatusLabelAndColor(delegation.status);

  const Badge = () => {
    if (type === 'delegates' || delegation.status === DelegationStatus.ACTIVE) {
      return <Chip label={label} color={color} />;
    } else {
      return <AcceptButton id={delegation.mandateId} />;
    }
  };

  return (
    <Card
      sx={{
        marginBottom: '16px',
        padding: '24px',
        borderRadius: '8px',
        boxShadow:
          '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
      }}
    >
      <CardHeader title={<Badge />} action={<Menu menuType={type} id={delegation.mandateId} />} />
      <CardContent>
        <Typography mt={1} variant="subtitle2">
          {t('deleghe.table.name')}
        </Typography>
        <Typography>
          {delegation.delegate.firstName} {delegation.delegate.lastName}
        </Typography>
        <Typography mt={1} variant="subtitle2">
          {t('deleghe.table.email')}
        </Typography>
        <Typography>{delegation.email}</Typography>
        <Typography mt={1} variant="subtitle2">
          {t('deleghe.table.delegationStart')}
        </Typography>
        <Typography>{delegation.datefrom}</Typography>
        <Typography mt={1} variant="subtitle2">
          {t('deleghe.table.delegationEnd')}
        </Typography>
        <Typography>{delegation.dateto}</Typography>
        <Typography mt={1} variant="subtitle2">
          {t('deleghe.table.permissions')}
        </Typography>
        {delegation.visibilityIds.length === 0 ? (
          <Typography>{t('deleghe.table.allNotifications')}</Typography>
        ) : (
          <Box>
            <Typography>{t('deleghe.table.notificationsFrom')}</Typography>
            <List
              sx={{
                padding: 0,
                display: 'revert',
              }}
            >
              {delegation.visibilityIds.map((e) => (
                <ListItem key={e.uniqueIdentifier} sx={{ paddingLeft: 0, display: 'revert' }}>
                  {e.name}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DelegationCard;
