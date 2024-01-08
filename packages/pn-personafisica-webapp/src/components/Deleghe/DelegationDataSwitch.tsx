import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Chip, Typography } from '@mui/material';
import { Row, useIsMobile } from '@pagopa-pn/pn-commons';

import { DelegationColumnData, DelegationData } from '../../models/Deleghe';
import { DelegationStatus, getDelegationStatusKeyAndColor } from '../../utility/status.utility';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

const DelegationDataSwitch: React.FC<{
  data: Row<DelegationData>;
  type: keyof DelegationColumnData;
  menuType: 'delegators' | 'delegates';
  setShowCodeModal?: Dispatch<
    SetStateAction<{
      open: boolean;
      name: string;
      code: string;
    }>
  >;
}> = ({ data, type, menuType, setShowCodeModal }) => {
  const { t } = useTranslation(['deleghe']);
  const isMobile = useIsMobile();

  if (type === 'name') {
    return (
      <Typography fontWeight="bold" fontSize={isMobile ? '1rem' : undefined}>
        {data.name}
      </Typography>
    );
  }
  if (type === 'startDate') {
    return <>{data.startDate}</>;
  }
  if (type === 'endDate') {
    return <>{data.endDate}</>;
  }
  if (type === 'visibilityIds') {
    return (
      <OrganizationsList
        organizations={data.visibilityIds}
        visibleItems={3}
        textVariant={isMobile ? 'body2' : undefined}
      />
    );
  }
  if (type === 'status') {
    const { color, key } = getDelegationStatusKeyAndColor(data.status);
    if (data.status === DelegationStatus.ACTIVE || menuType === 'delegates') {
      return <Chip id={`chip-status-${color}`} label={t(key)} color={color} />;
    }
    return <AcceptButton id={data.id} name={data.name} />;
  }
  if (type === 'menu') {
    return (
      <Menu
        menuType={menuType}
        id={data.id}
        verificationCode={data.verificationCode}
        name={data.name}
        setCodeModal={setShowCodeModal}
      />
    );
  }
  return <></>;
};

export default DelegationDataSwitch;
