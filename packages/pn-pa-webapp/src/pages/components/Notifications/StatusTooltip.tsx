import Chip from '@mui/material/Chip';
import { CustomTooltip } from '@pagopa-pn/pn-commons';

function StatusTooltip({tooltip, label, color}: {tooltip: string; label: string; color: "warning" | "error" | "success" | "info" | "default" | "primary" | "secondary" | undefined}) {
  const [title, body] = tooltip.split(':');

  const tooltipContent = 
    <div>
      <div className="title">{title.trim().toUpperCase()}</div>
      <div>{body.trim()}</div>
    </div>;

  return (
    <CustomTooltip openOnClick tooltipContent={tooltipContent}>
      <Chip label={label} color={color}/>
    </CustomTooltip>
  );
}

export default StatusTooltip;