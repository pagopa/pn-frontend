import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { Button } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

type Props = {
  allExpanded: boolean;
  onClick: () => void;
};

const TimelineExpandAllButton = ({ allExpanded, onClick }: Props) => (
  <Button
    variant="text"
    size="small"
    data-testid="timeline-expand-all"
    endIcon={allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
    onClick={onClick}
    sx={{ flexShrink: 0, ml: 'auto', p: 0 }}
  >
    {getLocalizedOrDefaultLabel(
      'notifications',
      allExpanded ? 'detail.timeline.collapse-all-groups' : 'detail.timeline.expand-all-groups'
    )}
  </Button>
);

export default TimelineExpandAllButton;
