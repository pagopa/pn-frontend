import React from 'react';

import { Box, BoxProps, Button, Tooltip } from '@mui/material';
import { Tag } from '@pagopa/mui-italia';

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
  ariaLabel?: string;
}> = ({ arrayChildren, visibleItems, dataTestId }) => (
  <Tag value={`+${arrayChildren.length - visibleItems}`} data-testid={dataTestId} />
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
        <Box>
          {!disableTooltip && (
            <Tooltip title={arrayChildren.slice(visibleItems).map((c) => c)} arrow describeChild>
              <Button sx={{ width: 'fit-content', p: 0, m: 0, height: 'auto' }}>
                <TagIndicator
                  arrayChildren={arrayChildren}
                  visibleItems={visibleItems as number}
                  dataTestId="custom-tooltip-indicator"
                />
              </Button>
            </Tooltip>
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
