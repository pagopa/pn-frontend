import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Link, SxProps, Theme, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../hooks';
interface Props {
  /** callback used to retrieve the text to be copied */
  getValue: () => string;
  /** an optional text to be displayed near the "copy to clipboard" icon */
  text?: string;
  tooltipMode?: boolean;
  tooltip?: string;
  tooltipBefore?: string;
  disabled?: boolean;
  iconProps?: SxProps<Theme>;
  buttonProps?: SxProps<Theme>;
}

const CopyToClipboard: React.FC<Props> = ({
  getValue,
  text,
  tooltipMode,
  tooltip = '',
  tooltipBefore = '',
  disabled = false,
  iconProps,
  buttonProps,
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
      sx={{ ...alertButtonStyle, ...buttonProps }}
      onClick={doCopyToClipboard}
      disabled={disabled}
      aria-label={copied ? tooltip : tooltipBefore}
    >
      {copied && (
        <Tooltip arrow={true} title={tooltip} placement="top">
          <CheckIcon fontSize="small" sx={{ ...iconProps, m: '5px' }} />
        </Tooltip>
      )}
      {!copied && <ContentCopyIcon fontSize="small" sx={{ ...iconProps, m: '5px' }} />}
      {text}
    </Button>
  );
};

export default CopyToClipboard;
