import { Tag } from '@pagopa/mui-italia';
import { Box } from '@mui/material';
import React from 'react';
import CustomTooltip from '../CustomTooltip';
interface CustomTagGroupProps {
  /** how many items will be visible */
  visibleItems?: number;
  /** callback function when tooltip is opened */
  onOpen?: () => void;
  children: JSX.Element | Array<JSX.Element>;
}
const CustomTagGroup = ({ visibleItems, onOpen, children }: CustomTagGroupProps) => {
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
          <CustomTooltip
            openOnClick={false}
            onOpen={onOpen}
            tooltipContent={<>{arrayChildren.slice(visibleItems).map((c) => c)}</>}
          >
            <Box sx={{ cursor: 'pointer', display: 'inline-block' }} data-testid="custom-tooltip-indicator" role="button">
              <Tag value={`+${arrayChildren.length - (visibleItems as number)}`} />
            </Box>
          </CustomTooltip>
        </Box>
      )}
    </>
  );
};

export default CustomTagGroup;
