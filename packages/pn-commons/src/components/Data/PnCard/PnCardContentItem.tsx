import React, { Children, ReactNode } from 'react';

import { Typography } from '@mui/material';

import { ValueMode } from '../../../models/SmartTable';
import { isExplicitChild } from '../../../utility/children.utility';
import DataValue from '../DataValue';

type Props = {
  children: ReactNode;
  label: ReactNode;
  mode?: ValueMode;
  wrapValueInTypography?: boolean;
  testId?: string;
};

const PnCardContentItem: React.FC<Props> = ({
  children,
  label,
  mode,
  wrapValueInTypography = true,
  testId,
}) => {
  const hasDataValue = Children.toArray(children).some((child) =>
    isExplicitChild(child, 'DataValue')
  );
  return (
    <>
      <Typography
        sx={{ fontWeight: 'bold' }}
        variant="caption"
        data-testid={testId ? `${testId}Label` : null}
      >
        {label}
      </Typography>
      {hasDataValue && children}
      {!hasDataValue && (
        <DataValue
          data-testid={testId ? `${testId}Value` : undefined}
          mode={mode}
          slots={{ root: wrapValueInTypography ? Typography : undefined }}
          slotProps={{ root: wrapValueInTypography ? { variant: 'body2' } : undefined }}
        >
          {children}
        </DataValue>
      )}
    </>
  );
};

export default PnCardContentItem;
