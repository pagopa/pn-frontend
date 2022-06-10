import { Button, Link, SxProps, Theme } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useIsMobile } from "../hooks/IsMobile";

interface Props {
  getValue: () => string;
  text?: string;
}

const CopyToClipboard: React.FC<Props> = ({ getValue, text }) => {
  console.log("COPY_TO_CLIPBOARD");
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
      // startIcon={ContentCopyIcon}
      onClick={doCopyToClipboard}
    >
      <ContentCopyIcon fontSize="small" sx={{ m: '5px'}} />
      {text}
    </Button>
  );
};

export default CopyToClipboard;