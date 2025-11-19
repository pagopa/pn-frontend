import { ComponentPropsWithoutRef, useEffect, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, SxProps, Theme, Tooltip } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { useIsMobile } from '../hooks/useIsMobile';

type AllowedSlots = typeof Button | typeof ButtonNaked;
type AllowedSlotProps = ComponentPropsWithoutRef<AllowedSlots>;

type Props = {
  /** callback used to retrieve the text to be copied */
  getValue: () => string;
  /** an optional text to be displayed near the "copy to clipboard" icon */
  text?: string;
  textPosition?: 'start' | 'end';
  tooltipMode?: boolean;
  tooltip?: string;
  tooltipBefore?: string;
  disabled?: boolean;
  slot?: AllowedSlots;
  slotProps?: AllowedSlotProps;
};

const CopyToClipboard: React.FC<Props> = ({
  getValue,
  text,
  textPosition = 'end',
  tooltipMode,
  tooltip = '',
  tooltipBefore = '',
  disabled = false,
  slot,
  slotProps = {},
}) => {
  const padding = tooltipMode ? 0 : undefined;
  const alertButtonStyle: SxProps<Theme> = useIsMobile()
    ? { textAlign: 'center', padding }
    : { textAlign: 'center', minWidth: 'max-content', padding };

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  const doCopyToClipboard = async () => {
    const value = getValue();

    if ('clipboard' in navigator) {
      if (tooltipMode && !copied) {
        setCopied(true);
      }
      return await navigator.clipboard.writeText(value);
    } else {
      // execCommand is deprecated: we do not support IE so we return a console.log message
      // return document.execCommand('copy', true, value);
      console.log('Operation not supported');
    }
  };

  const SlotComponent = slot || Button;

  return (
    <SlotComponent
      color="primary"
      sx={{ ...alertButtonStyle }}
      onClick={doCopyToClipboard}
      disabled={disabled}
      aria-label={copied ? tooltip : tooltipBefore}
      {...slotProps}
    >
      {textPosition === 'start' && text}
      {copied && (
        <Tooltip arrow={true} title={tooltip} placement="top">
          <CheckIcon fontSize="small" sx={{ m: '5px' }} />
        </Tooltip>
      )}
      {!copied && <ContentCopyIcon fontSize="small" sx={{ m: '5px' }} />}
      {textPosition === 'end' && text}
    </SlotComponent>
  );
};

export default CopyToClipboard;
