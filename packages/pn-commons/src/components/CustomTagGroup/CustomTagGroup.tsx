import { Tag } from '@pagopa/mui-italia';
import { Box, BoxProps } from '@mui/material';
import React from 'react';
import CustomTooltip from '../CustomTooltip';

interface CustomTagGroupProps {
  /** how many items will be visible */
  visibleItems?: number;
  /** disable tooltip popup on tag +X */
  disableTooltip?: boolean;
  /** callback function when tooltip is opened */
  onOpen?: () => void;
  children: JSX.Element | Array<JSX.Element>;
}

const TagIndicator: React.FC<{
  boxProps?: BoxProps;
  arrayChildren: Array<JSX.Element>;
  visibleItems: number;
  dataTestId: string;
}> = ({ boxProps, arrayChildren, visibleItems, dataTestId }) => (
  <Box {...boxProps} sx={{ cursor: 'pointer', display: 'inline-block' }} data-testid={dataTestId}>
    <Tag value={`+${arrayChildren.length - visibleItems}`} />
  </Box>
);

const CustomTagGroup = ({
  visibleItems,
  disableTooltip = false,
  onOpen,
  children,
}: CustomTagGroupProps) => {
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
            <CustomTooltip
              openOnClick={false}
              onOpen={onOpen}
              tooltipContent={<>{arrayChildren.slice(visibleItems).map((c) => c)}</>}
            >
              <div>
                <TagIndicator
                  boxProps={{ role: 'button' }}
                  arrayChildren={arrayChildren}
                  visibleItems={visibleItems as number}
                  dataTestId="custom-tooltip-indicator"
                />
              </div>
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
