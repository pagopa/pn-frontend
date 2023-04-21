import { Tag } from '@pagopa/mui-italia';
import { Box } from '@mui/material';
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
  const tagIndicator = <Tag value={`+${arrayChildren.length - (visibleItems as number)}`} />;
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
              <Box
                sx={{ cursor: 'pointer', display: 'inline-block' }}
                data-testid="custom-tooltip-indicator"
                role="button"
              >
                {tagIndicator}
              </Box>
            </CustomTooltip>
          )}
          {disableTooltip && (
            <Box
              sx={{ cursor: 'pointer', display: 'inline-block' }}
              data-testid="remaining-tag-indicator"
            >
              {tagIndicator}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default CustomTagGroup;
