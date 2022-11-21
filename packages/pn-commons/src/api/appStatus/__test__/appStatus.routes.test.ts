import { KnownFunctionality } from "../../../models";
import { DOWNTIME_HISTORY, DOWNTIME_LEGAL_FACT_DETAILS, DOWNTIME_STATUS } from "../appStatus.routes";

describe("AppStatus routes", () => {
  it("should compile DOWNTIME_STATUS", () => {
    expect(DOWNTIME_STATUS()).toEqual("/downtime/v1/status");
  });

  it("should compile DOWNTIME_HISTORY with minimal parameters set", () => {
    expect(DOWNTIME_HISTORY({ startDate: "2022-10-20T09:34:51Z"})).toEqual(
      `/downtime/v1/history?fromTime=${encodeURIComponent('2022-10-20T09:34:51Z')}`
    );
  });

  it("should compile DOWNTIME_HISTORY with all parameters set", () => {
    expect(DOWNTIME_HISTORY({ 
      startDate: "2022-10-18T09:34:51Z",
      endDate: "2022-10-20T09:34:51Z",
      functionality: [KnownFunctionality.NotificationWorkflow],
      page: "pageId",
      size: "28",
    })).toEqual(
      `/downtime/v1/history?fromTime=${encodeURIComponent('2022-10-18T09:34:51Z')}&toTime=${encodeURIComponent('2022-10-20T09:34:51Z')}&functionality=NOTIFICATION_WORKFLOW&page=pageId&size=28`
    );
  });

  it("should compile DOWNTIME_HISTORY with two functionalities", () => {
    expect(DOWNTIME_HISTORY({ 
      startDate: "2022-10-18T09:34:51Z",
      functionality: [KnownFunctionality.NotificationWorkflow, KnownFunctionality.NotificationCreate],
      size: "54",
    })).toEqual(
      `/downtime/v1/history?fromTime=${encodeURIComponent('2022-10-18T09:34:51Z')}&functionality=NOTIFICATION_WORKFLOW&functionality=NOTIFICATION_CREATE&size=54`
    );
  });

  it("should compile DOWNTIME_LEGAL_FACT_DETAILS for a given legalFactId", () => {
    expect(DOWNTIME_LEGAL_FACT_DETAILS('some-legal-fact')).toEqual("/downtime/v1/legal-facts/some-legal-fact");
  });
});


