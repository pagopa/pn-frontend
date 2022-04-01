import { useTranslation } from 'react-i18next';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const LegalContactsDisclosure = () => {
  const { t } = useTranslation(['recapiti']);

  const descriptionBox = [
    { id: 'save-money', label: t('legal-contacts.save-money', { ns: 'recapiti' }) },
    { id: 'avoid-waste', label: t('legal-contacts.avoid-waste', { ns: 'recapiti' }) },
    {
      id: 'fast-notification',
      label: t('legal-contacts.fast-notification', { ns: 'recapiti' }),
    },
  ];

  return (
    <List sx={{ margin: '20px 0' }}>
      {descriptionBox.map((d) => (
        <ListItem key={d.id}>
          <ListItemIcon>
            <CheckIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography color="text.primary" fontWeight={400} fontSize={16}>
              {d.label}
            </Typography>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default LegalContactsDisclosure;
