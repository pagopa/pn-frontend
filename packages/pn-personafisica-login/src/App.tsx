import { useEffect } from "react";
import { useUnload } from "@pagopa-pn/pn-commons";
import Router from './navigation/routes';
import { mixpanelInit, trackEventByType } from "./utils/mixpanel";
import { TrackEventType } from "./utils/events";


function App() {

  useEffect(() => {
    // init mixpanel
    mixpanelInit();
  }, []);

  useUnload((e: Event) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    e.defaultPrevented;
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

  return <Router />;
}

export default App;
