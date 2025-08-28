import React from 'react';

import { Box, BoxProps, Button, Tooltip } from '@mui/material';
import { Tag } from '@pagopa/mui-italia';
import CustomTooltip from '../CustomTooltip';

interface CustomTagGroupProps {
  /** how many items will be visible */
  visibleItems?: number;
  /** disable tooltip popup on tag +X */
  disableTooltip?: boolean;
  /** callback function when tooltip is opened */
  onOpen?: () => void;
  /** tags list */
  children?: React.ReactNode;
}

const TagIndicator: React.FC<{
  boxProps?: BoxProps;
  arrayChildren: Array<JSX.Element>;
  visibleItems: number;
  dataTestId: string;
}> = ({ boxProps, arrayChildren, visibleItems, dataTestId }) => (
  <Box
    {...boxProps}
    sx={{ cursor: 'pointer', display: 'inline-block' }}
    data-testid={dataTestId}
    aria-hidden="true"
  >
    <Tag value={`+${arrayChildren.length - visibleItems}`} aria-hidden="true" />
  </Box>
);

const CustomTagGroup: React.FC<CustomTagGroupProps> = ({
  visibleItems,
  disableTooltip = false,
  children,
}) => {
  const arrayChildren = React.Children.count(children)
    ? (children as Array<JSX.Element>)
    : [children as JSX.Element];
  const isOverflow = visibleItems ? arrayChildren.length > visibleItems : false;
  const maxCount = isOverflow ? visibleItems : arrayChildren.length;

  return (
    <>
      {arrayChildren.slice(0, maxCount).map((c) => c)}
      {isOverflow && (
        <Box aria-hidden="true">
          {!disableTooltip && (
            <CustomTooltip
              openOnClick={false}
              onOpen={onOpen}
              tooltipContent={<>{arrayChildren.slice(visibleItems).map((c) => c)}</>}
            >
              <Box sx={{ width: 'fit-content' }} aria-hidden="true">
                <TagIndicator
                  arrayChildren={arrayChildren}
                  visibleItems={visibleItems as number}
                  dataTestId="custom-tooltip-indicator"
                </Box>
            </CustomTooltip>
          )}
          {disableTooltip && (
            <TagIndicator
              dataTestId="remaining-tag-indicator"
              arrayChildren={arrayChildren}
              visibleItems={visibleItems as number}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default CustomTagGroup;
