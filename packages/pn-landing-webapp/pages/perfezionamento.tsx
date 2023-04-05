import { Infoblock } from "@pagopa/mui-italia";
import { NextPage } from "next";
import { useState } from "react";
import {
  HeadingTitle,
  Tabs,
  getAppData,
  getHeadingTitleData,
  getInfoblockData,
  getTabsData,
} from "api";
import { UserType } from "model";

const Perfezionamento: NextPage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (tab: number) => {
    setCurrentTab(tab);
  };

  return (
    <>
      <HeadingTitle
        {...getHeadingTitleData(
          UserType.PF,
          "heading title notification viewed 1"
        )}
      />
      <Tabs
        {...getTabsData(UserType.PF, "tabs notification viewed 1")}
        onTabChange={handleTabChange}
      />
      {getAppData()[UserType.PF].tabs.map((v) => (
        <Infoblock
          key={v.name}
          {...getInfoblockData(
            UserType.PF,
            `infoblock notification viewed ${currentTab + 1}`
          )}
        />
      ))}
    </>
  );
};

export default Perfezionamento;
