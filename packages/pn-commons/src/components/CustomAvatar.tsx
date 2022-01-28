import React from 'react';
import { Avatar } from '@mui/material';

type Props = {
  customSrc?: string | undefined;
  customAlt?: string | undefined;
  customWidth?: string | undefined;
  customHeight?: string | undefined;
  loading?: boolean;
  id?: string;
};
export default function CustomAvatar({
  customAlt,
  customSrc,
  customWidth,
  customHeight,
  id,
  loading,
}: Props) {
  return (
    <React.Fragment>
      <Avatar
        id={id}
        alt={customAlt}
        src={customSrc}
        sx={{
          width: customWidth,
          height: customHeight,
          display: !loading ? undefined : 'none',
          color: 'palette.background.default',
          backgroundColor: '#CCD4DC',
        }}
      />
    </React.Fragment>
  );
}
