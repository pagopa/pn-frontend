import {
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  GrowProps,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRef, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("lg"));
};

const Tabs = ({
  tabs,
  onTabChange,
}: {
  tabs: Array<string>;
  onTabChange: (v: number) => void;
}) => {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleChangeTab = (newValue: number) => {
    setCurrentTab(newValue);
    setDropdownOpen(false);
    onTabChange(newValue);
  };

  const handleToggleDropdown = () => {
    setDropdownOpen((prevDropdownOpen) => !prevDropdownOpen);
  };

  const handleCloseDropdown = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setDropdownOpen(false);
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      {!isMobile && (
        <ButtonGroup color="primary">
          {tabs.map((tab, index) => (
            <Button
              sx={{
                backgroundColor:
                  currentTab === index ? "rgba(0, 115, 230, 0.08)" : undefined,
              }}
              onClick={() => handleChangeTab(index)}
              size="large"
              value={index}
              key={tab}
            >
              {tab}
            </Button>
          ))}
        </ButtonGroup>
      )}
      {isMobile && (
        <>
          <ButtonGroup ref={anchorRef}>
            <Button onClick={handleToggleDropdown}>{tabs[currentTab]}</Button>
            <Button
              aria-controls={dropdownOpen ? "split-button-menu" : undefined}
              aria-expanded={dropdownOpen ? "true" : undefined}
              aria-haspopup="menu"
              onClick={handleToggleDropdown}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={dropdownOpen}
            anchorEl={anchorRef.current}
            transition
            disablePortal>
            {({
              TransitionProps,
              placement,
            }: {
              TransitionProps: GrowProps;
              placement: string;
            }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleCloseDropdown}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {tabs.map((tab, index) => (
                        <MenuItem
                          key={tab}
                          selected={index === currentTab}
                          onClick={() => handleChangeTab(index)}
                        >
                          {tab}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </>
      )}
    </Box>
  );
};

export default Tabs;
