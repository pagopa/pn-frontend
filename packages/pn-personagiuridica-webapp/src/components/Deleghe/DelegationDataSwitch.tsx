import { useTranslation } from 'react-i18next';

import { Box, Chip, Typography } from '@mui/material';
import { CustomTagGroup, Row } from '@pagopa-pn/pn-commons';
import { Tag } from '@pagopa/mui-italia';

import { DelegationColumnData, DelegationStatus } from '../../models/Deleghe';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { getDelegationStatusKeyAndColor } from '../../utility/status.utility';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

type Props = {
  data: Row<DelegationColumnData>;
  type: keyof DelegationColumnData;
  menuType: 'delegators' | 'delegates';
  onAction: (data: any) => void;
  onAccept?: () => void;
};

const DelegationDataSwitch: React.FC<Props> = ({
  data,
  type,
  menuType,
  onAction,
  onAccept = () => {},
}) => {
  const { t } = useTranslation(['deleghe']);
  const userLogged = useAppSelector((state: RootState) => state.userState.user);

  if (type === 'name') {
    return <Typography fontWeight="bold">{data.name}</Typography>;
  }
  if (type === 'startDate') {
    return <>{data.startDate}</>;
  }
  if (type === 'endDate') {
    return <>{data.endDate}</>;
  }
  if (type === 'visibilityIds') {
    return <OrganizationsList organizations={data.visibilityIds} visibleItems={3} />;
  }
  if (type === 'groups') {
    if (data.groups.length > 0) {
      return (
        <CustomTagGroup visibleItems={3}>
          {data.groups.map((group) => (
            <Box sx={{ mb: 1, mr: 1, display: 'inline-block' }} key={group.id}>
              <Tag value={group.name} />
            </Box>
          ))}
        </CustomTagGroup>
      );
    }
    return <></>;
  }
  if (type === 'status') {
    const { color, key } = getDelegationStatusKeyAndColor(data.status);
    if (data.status === DelegationStatus.ACTIVE || menuType === 'delegates') {
      return <Chip id={`chip-status-${color}`} label={t(key)} color={color} />;
    }
    return <AcceptButton id={data.id} name={data.name} onAccept={onAccept} />;
  }
  if (type === 'menu') {
    return (
      <Menu
        menuType={menuType}
        id={data.id}
        row={data}
        userLogged={userLogged}
        onAction={onAction}
      />
    );
  }
  return <></>;
};

export default DelegationDataSwitch;
