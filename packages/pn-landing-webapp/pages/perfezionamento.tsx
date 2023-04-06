import { Infoblock } from "@pagopa/mui-italia";
import { NextPage } from "next";
import { useRef, useState } from "react";
import {
  HeadingTitle,
  Tabs,
  getHeadingTitleData,
  getInfoblockData,
  getTabsData,
} from "api";
import { UserType } from "model";
import { Box, Slide } from "@mui/material";

const Perfezionamento: NextPage = () => {
  const [currentTab, setCurrentTab] = useState({ index: 0, visible: true });
  const transitionDuration = 500;
  const containerRef = useRef(null);
  const tabsData = getTabsData(UserType.PF, "tabs notification viewed 1");
  const handleTabChange = (tab: number) => {
    if (tab === currentTab.index) {
      return;
    }
    setCurrentTab({ index: currentTab.index, visible: false });
    setTimeout(
      () => setCurrentTab({ index: tab, visible: true }),
      transitionDuration
    );
  };

  return (
    <>
      <HeadingTitle
        {...getHeadingTitleData(
          UserType.PF,
          "heading title notification viewed 1"
        )}
      />
      <Tabs {...tabsData} onTabChange={handleTabChange} />
      <Box ref={containerRef}>
        <Slide
          direction="right"
          in={currentTab.visible}
          timeout={transitionDuration}
        >
          <Box>
            <Infoblock
              {...getInfoblockData(
                UserType.PF,
                `infoblock notification viewed ${currentTab.index + 1}`
              )}
            />
          </Box>
        </Slide>
      </Box>
    </>
  );
};

export default Perfezionamento;
