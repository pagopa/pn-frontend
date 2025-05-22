import { useEffect, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Link, SxProps, Theme, Tooltip } from '@mui/material';

import { useIsMobile } from '../hooks';

type Props = {
  /** callback used to retrieve the text to be copied */
  getValue: () => string;
  /** an optional text to be displayed near the "copy to clipboard" icon */
  text?: string;
  textBefore?: boolean;
  tooltipMode?: boolean;
  tooltip?: string;
  tooltipBefore?: string;
  disabled?: boolean;
};

const CopyToClipboard: React.FC<Props> = ({
  getValue,
  text,
  textBefore,
  tooltipMode,
  tooltip = '',
  tooltipBefore = '',
  disabled = false,
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

  return (
    <Button
      component={Link}
      color="primary"
      sx={{ ...alertButtonStyle }}
      onClick={doCopyToClipboard}
      disabled={disabled}
      aria-label={copied ? tooltip : tooltipBefore}
    >
      {textBefore && text}
      {copied && (
        <Tooltip arrow={true} title={tooltip} placement="top">
          <CheckIcon fontSize="small" sx={{ m: '5px' }} />
        </Tooltip>
      )}
      {!copied && <ContentCopyIcon fontSize="small" sx={{ m: '5px' }} />}
      {!textBefore && text}
    </Button>
  );
};

export default CopyToClipboard;
