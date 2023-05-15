import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { RootState } from '../../redux/store';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getGroups } from '../../redux/delegation/actions';

type Props = {
  currentGroup: string;
  onGroupSelection: (id: string) => void;
};

const GroupSelector: React.FC<Props> = ({ currentGroup, onGroupSelection }) => {
  const { t } = useTranslation(['notifiche']);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state: RootState) => state.delegationsState.groups);

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    void dispatch(getGroups());
  }, []);

  return (
    <Box data-testid="groupSelector" display="inline-block" sx={{ verticalAlign: 'middle', mx: 2 }}>
      <Box>
        <Button
          onClick={handleMenuClick}
          size="small"
          variant="contained"
          data-testid="groupSelectorButton"
          aria-label={t('table.group-selector-title')}
          aria-controls={open ? 'group-selector' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          endIcon={<ArrowDropDownIcon />}
        >
          {currentGroup && groups.find((group) => group.id === currentGroup)?.name}
        </Button>
      </Box>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        id="group-selector"
      >
        {groups.map((group) => (
          <MenuItem key={group.id} onClick={() => onGroupSelection(group.id)}>
            {group.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default GroupSelector;
