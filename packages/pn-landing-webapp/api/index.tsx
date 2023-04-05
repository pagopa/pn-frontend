import { useContext, useRef, useState } from "react";

import {
  HeroProps,
  HorizontalNavProps,
  InfoblockProps,
  ShowcaseProps,
  WalkthroughProps,
} from "@pagopa/mui-italia";

import { IAppData, ITabsProps, UserType } from "model";
import LangContext from "provider/lang-context";

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
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IHeadingTitleProps } from "../model/index";

import { deAppData } from "./data/de";
import { enAppData } from "./data/en";
import { frAppData } from "./data/fr";
import { itAppData } from "./data/it";
import { slAppData } from "./data/sl";

export const getAppData = (): IAppData => {
  const lang = useContext(LangContext);

  switch (lang.selectedLanguage) {
    case "it":
      return itAppData;
    case "en":
      return enAppData;
    case "fr":
      return frAppData;
    case "de":
      return deAppData;
    case "sl":
      return slAppData;
    default:
      return itAppData;
  }
};

export const getHeroData = (userType: UserType = UserType.PA): HeroProps =>
  getAppData()[userType].hero;

export const getAllInfoblocksData = (
  userType: UserType = UserType.PA
): Array<InfoblockProps> =>
  getAppData()[userType].infoblocks.map((item) => item.data);

export const getInfoblockData = (
  userType: UserType = UserType.PA,
  name: string = ""
): InfoblockProps => {
  const infoblock = getAppData()[userType].infoblocks.filter(
    (item) => item.name === name
  )[0];
  return infoblock.data;
};

export const getAllShowcasesData = (
  userType: UserType = UserType.PA
): Array<ShowcaseProps> =>
  getAppData()[userType].showcases.map((item) => item.data);

export const getShowcaseData = (
  userType: UserType = UserType.PA,
  name: string = ""
): ShowcaseProps => {
  const infoblock = getAppData()[userType].showcases.filter(
    (item) => item.name === name
  )[0];
  return infoblock.data;
};

export const getWalkthroughData = (
  userType: UserType = UserType.PA
): WalkthroughProps => getAppData()[userType].walkthrough;

/**
 * Even though the HorizontalNav component is not currently used we keep all
 * its functionalities available so it can be quickly added to any page of
 * the landing site
 */
export const getHorizontalNavData = (
  userType: UserType = UserType.PA
): HorizontalNavProps => getAppData()[userType].horizontalNav;

// export const getFooterData = (userType: UserType = UserType.PA): FooterProps => getAppData()[userType].footer;

export const getHeadingTitleData = (
  userType: UserType = UserType.PA,
  name: string = ""
): IHeadingTitleProps => {
  const headingTitle = getAppData()[userType].headingTitles.filter(
    (item) => item.name === name
  )[0];
  return headingTitle.data;
};

export const getTabsData = (
  userType: UserType = UserType.PA,
  name: string = ""
): ITabsProps => {
  const tab = getAppData()[userType].tabs.filter(
    (item) => item.name === name
  )[0];
  return tab.data;
};

export const HeadingTitle = ({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string | JSX.Element;
}) => (
  <Box sx={{ textAlign: "center" }}>
    <Typography variant="h4" sx={{ mb: 3 }}>
      {title}
    </Typography>
    <Typography sx={{ mb: 4 }} variant="body2">
      {subtitle}
    </Typography>
  </Box>
);

export const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("lg"));
};

export const Tabs = ({
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
            disablePortal
          >
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
