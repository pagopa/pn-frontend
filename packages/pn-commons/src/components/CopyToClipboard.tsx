import { Button, Link, SxProps, Theme } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useIsMobile } from "../hooks/useIsMobile";

interface Props {
  /** callback used to retrieve the text to be copied */
  getValue: () => string;
  /** an optional text to be displayed near the "copy to clipboard" icon */
  text?: string;
}

const CopyToClipboard: React.FC<Props> = ({ getValue, text }) => {
  const alertButtonStyle: SxProps<Theme> = useIsMobile()
    ? { textAlign: 'center' }
    : { textAlign: 'center', minWidth: 'max-content' };

  const doCopyToClipboard = async () => {
    const value = getValue();

    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(value);
    } else {
      return document.execCommand('copy', true, value);
    }
  };
  
  return (
    <Button
      component={Link}
      color="primary"
      sx={alertButtonStyle}
      onClick={doCopyToClipboard}
    >
      <ContentCopyIcon fontSize="small" sx={{ m: '5px'}} />
      {text}
    </Button>
  );
};

export default CopyToClipboard;