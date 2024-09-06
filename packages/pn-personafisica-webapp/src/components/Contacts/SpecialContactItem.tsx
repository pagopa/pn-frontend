import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { ChannelType, DigitalAddress } from '../../models/contacts';
import { allowedAddressTypes } from '../../utility/contacts.utility';

type Props = {
  addresses: Array<DigitalAddress>;
  onEdit: (
    value: string,
    channelType: ChannelType,
    sender: { senderId: string; senderName: string }
  ) => void;
  onDelete: (
    value: string,
    channelType: ChannelType,
    sender: { senderId: string; senderName: string }
  ) => void;
};

type Field = {
  id: string;
  label: string;
  labelRoot: string;
  address?: DigitalAddress;
};

const SpecialContactElem: React.FC<Props> = ({ addresses, onDelete, onEdit }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const isMobile = useIsMobile();

  const fields: Array<Field> = allowedAddressTypes.map((type) => ({
    id: `${addresses[0].senderId}_${type.toLowerCase()}`,
    label: t(`special-contacts.${type.toLowerCase()}`, { ns: 'recapiti' }),
    labelRoot: type === ChannelType.PEC ? 'legal-contacts' : 'courtesy-contacts',
    address: addresses.find((a) => a.channelType === type),
  }));

  const jsxField = (f: Field) => (
    <>
      {f.address ? (
        <>
          <Stack direction="row" spacing={1}>
            <VerifiedIcon
              fontSize="small"
              color="success"
              sx={{ position: 'relative', top: '2px' }}
            />
            <Box>
              <Typography
                sx={{
                  wordBreak: 'break-word',
                  fontWeight: 600,
                  mb: 2,
                }}
                variant="body2"
                data-testid={`special_${f.address.channelType}-typography`}
              >
                {f.address.value}
              </Typography>
              <ButtonNaked
                key="editButton"
                color="primary"
                onClick={() =>
                  onEdit(f.address?.value ?? '', f.address?.channelType ?? ChannelType.EMAIL, {
                    senderId: f.address?.senderId ?? '',
                    senderName: f.address?.senderName ?? '',
                  })
                }
                sx={{ mr: 2 }}
                disabled={false}
                data-testid={`modifyContact-special_${f.address.channelType}`}
                size="medium"
              >
                {t('button.modifica', { ns: 'common' })}
              </ButtonNaked>
              <ButtonNaked
                data-testid={`cancelContact-special_${f.address.channelType}`}
                color="error"
                // ATTENZIONE
                // al momento le api non accettano più sender alla volta
                // per testare il giro, si utilizza sempre il primo sender
                onClick={() =>
                  onDelete(f.address?.value ?? '', f.address?.channelType ?? ChannelType.EMAIL, {
                    senderId: f.address?.senderId ?? '',
                    senderName: f.address?.senderName ?? '',
                  })
                }
                disabled={false}
                size="medium"
              >
                {t('button.elimina', { ns: 'common' })}
              </ButtonNaked>
            </Box>
          </Stack>
        </>
      ) : (
        ''
      )}
    </>
  );

  if (isMobile) {
    return (
      <>
        <Typography variant="caption" fontWeight={600} lineHeight="18px">
          {t('special-contacts.sender', { ns: 'recapiti' })}
        </Typography>
        <Typography variant="caption" fontWeight={600} mt={0} mb={3}>
          {addresses[0].senderName}
        </Typography>
        {fields.map(
          (f) =>
            !!f.address && (
              <Stack key={f.id} sx={{ mb: 3 }}>
                <Typography variant="caption" fontWeight={600}>
                  {f.label}
                </Typography>
                {jsxField(f)}
              </Stack>
            )
        )}
      </>
    );
  }

  return (
    <TableRow>
      <TableCell
        width={100 / (fields.length + 1)}
        sx={{ verticalAlign: 'top', borderBottomColor: 'divider', py: 3, px: 0 }}
      >
        <Stack direction="column" spacing={1}>
          <Typography variant="caption" fontWeight={600}>
            {t(`special-contacts.sender`, { ns: 'recapiti' })}
          </Typography>
          <Typography variant="caption" fontWeight={600} fontSize="16px">
            {addresses[0].senderName}
          </Typography>
        </Stack>
      </TableCell>
      {fields.map((f) => (
        <TableCell
          width={100 / (fields.length + 1)}
          key={f.id}
          sx={{ verticalAlign: 'top', borderBottomColor: 'divider', py: 3, px: 0 }}
        >
          <Stack direction="column" spacing={1}>
            {f.address && (
              <Typography variant="caption" fontWeight={600} mt={0} mb={3}>
                {f.label}
              </Typography>
            )}
            {jsxField(f)}
          </Stack>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default SpecialContactElem;
