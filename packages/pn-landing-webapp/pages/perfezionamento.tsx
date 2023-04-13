import { Infoblock } from "@pagopa/mui-italia";
import { NextPage } from "next";
import { useRef, useState } from "react";
import { Box, Slide } from "@mui/material";

import {
  getCommonHeadingTitleData,
  getCommonInfoblockData,
  getCommonTabsData,
} from "api";
import HeadingTitle from "src/components/HeadingTitle";
import Tabs from "src/components/Tabs";

const Perfezionamento: NextPage = () => {
  const [currentTab, setCurrentTab] = useState({ index: 0, visible: true });
  const transitionDuration = 500;
  const containerRef = useRef(null);
  const tabsData = getCommonTabsData("tabs notification viewed 1");
  const headingTitleData = getCommonHeadingTitleData("heading title notification viewed 1");
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
      <HeadingTitle {...headingTitleData} />
      <Tabs {...tabsData} onTabChange={handleTabChange} />
      <Box ref={containerRef}>
        <Slide
          direction="right"
          in={currentTab.visible}
          timeout={transitionDuration}
        >
          <Box>
            <Infoblock
              {...getCommonInfoblockData(
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
