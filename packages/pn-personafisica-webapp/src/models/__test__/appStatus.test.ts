import { BEDowntimePage, BEDowntimePageValidator, BEIncident, BEIncidentValidator, BEStatus, BEStatusValidator } from "../appStatus";

describe("App Status model test", () => {
  it("incident validator - minimal valid incident", () => {
    const incident: BEIncident = {
      functionality: "NOTIFICATION_CREATE",
      status: "OK",
      startDate: "2022-10-21T06:07:08Z",
    };

    expect(new BEIncidentValidator().validate(incident)).toBeNull();
  });

  it("incident validator - valid incident with full data", () => {
    const incident: BEIncident = {
      functionality: "NOTIFICATION_CREATE",
      status: "KO",
      startDate: "2022-10-21T06:07:08Z",
      endDate: "2022-10-21T06:07:05Z",
      legalFactId: "some-id",
      fileAvailable: true,
    };

    expect(new BEIncidentValidator().validate(incident)).toBeNull();
  });

  it("incident validator - bad status", () => {
    const incident: BEIncident = {
      functionality: "NOTIFICATION_CREATE",
      status: "INVALID_STATUS",
      startDate: "2022-10-21T06:07:08Z",
    };

    const validationResult = new BEIncidentValidator().validate(incident);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.status).not.toBeUndefined();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
  });

  it("incident validator - missing functionality", () => {
    const incident: any = {
      status: "OK",
      startDate: "2022-10-21T06:07:08Z",
    };

    const validationResult = new BEIncidentValidator().validate(incident);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).not.toBeUndefined();
    expect(validationResult?.status).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
  });

  it("incident validator - bad-typed data", () => {
    const incident: any = {
      functionality: true,
      status: 4,
      startDate: "2022-10-21T06:07:08Z",
      fileAvailable: "toto",
    };

    const validationResult = new BEIncidentValidator().validate(incident);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).not.toBeUndefined();
    expect(validationResult?.status).not.toBeUndefined();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
    expect(validationResult?.fileAvailable).not.toBeUndefined();
  });

  it("incident validator - just bad-typed legalFactId", () => {
    const incident: any = {
      functionality: "NOTIFICATION_CREATE",
      status: "OK",
      startDate: "2022-10-21T06:07:08Z",
      endDate: "2022-10-21T06:07:05Z",
      legalFactId: {a: 3, b: "hello"},
      fileAvailable: true,
    };

    const validationResult = new BEIncidentValidator().validate(incident);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).toBeUndefined();
    expect(validationResult?.status).toBeUndefined();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
    expect(validationResult?.legalFactId).not.toBeUndefined();
    expect(validationResult?.fileAvailable).toBeUndefined();
  });

  it("incident validator - ill-formed start date", () => {
    const incident: BEIncident = {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: "not-a-date",
      endDate: "2022-10-21T06:07:05Z",
      fileAvailable: true,
    };

    const validationResult = new BEIncidentValidator().validate(incident);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).toBeUndefined();
    expect(validationResult?.status).toBeUndefined();
    expect(validationResult?.startDate).not.toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
    expect(validationResult?.fileAvailable).toBeUndefined();
  });

  it("incident validator - ill-formed end date", () => {
    const incident: BEIncident = {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: "2022-10-21T06:07:05Z",
      endDate: "2022-99-21T06:07:05Z",
      fileAvailable: true,
    };

    const validationResult = new BEIncidentValidator().validate(incident);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).not.toBeUndefined();
  });

  it("status validator - valid data with no incidents", () => {
    const status: BEStatus = {
      functionalities: ["NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZZATION", "NOTIFICATION_WORKFLOW"],
      openIncidents: [],
    }
    expect(new BEStatusValidator().validate(status)).toBeNull();
  });

  it("status validator - valid data with two incidents", () => {
    const status: BEStatus = {
      functionalities: ["NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZZATION", "NOTIFICATION_WORKFLOW"],
      openIncidents: [
        {
          functionality: "NOTIFICATION_CREATE",
          status: "OK",
          startDate: "2022-10-21T06:07:08Z",
          endDate: "2022-10-21T06:07:05Z",
          legalFactId: "some-id",
          fileAvailable: true,
        },        
        {
          functionality: "NEW_FUNCTIONALITY",
          status: "KO",
          startDate: "2022-10-21T06:07:08Z",
          fileAvailable: false,
        }
      ],
    }
    expect(new BEStatusValidator().validate(status)).toBeNull();
  });

  it("status validator - empty list of functionalities", () => {
    const status: BEStatus = {
      functionalities: [],
      openIncidents: [
        {
          functionality: "NOTIFICATION_CREATE",
          status: "OK",
          startDate: "2022-10-21T06:07:08Z",
          endDate: "2022-10-21T06:07:05Z",
          legalFactId: "some-id",
          fileAvailable: true,
        },        
        {
          functionality: "NEW_FUNCTIONALITY",
          status: "KO",
          startDate: "2022-10-21T06:07:08Z",
          fileAvailable: false,
        }
      ],
    }
    const validationResult = new BEStatusValidator().validate(status);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionalities).not.toBeUndefined();
    expect(validationResult?.openIncidents).toBeUndefined();
  });

  it("status validator - bad-typed start date in one incident", () => {
    const status: BEStatus = {
      functionalities: ["NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZZATION", "NOTIFICATION_WORKFLOW"],
      openIncidents: [
        {
          functionality: "NOTIFICATION_CREATE",
          status: "OK",
          startDate: "2022-10-99T06:07:08Z",
          endDate: "2022-10-21T06:07:05Z",
          legalFactId: "some-id",
          fileAvailable: true,
        },        
        {
          functionality: "NEW_FUNCTIONALITY",
          status: "KO",
          startDate: "2022-10-21T06:07:08Z",
          fileAvailable: false,
        }
      ],
    }
    const validationResult = new BEStatusValidator().validate(status);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionalities).toBeUndefined();
    expect(validationResult?.openIncidents).not.toBeUndefined();
  });

  it("downtime page validator - valid page with no downtime events", () => {
    const downtimePage: BEDowntimePage = {
      result: [],
    };
    expect(new BEDowntimePageValidator().validate(downtimePage)).toBeNull(); 
  });

  it("downtime page validator - valid page with three downtime events", () => {
    const downtimePage: BEDowntimePage = {
      result: [
        {
          functionality: "NOTIFICATION_CREATE",
          status: "OK",
          startDate: "2022-10-21T06:07:08Z",
          endDate: "2022-10-21T06:07:12Z",
          legalFactId: "some-legal-fact-id",
          fileAvailable: true,
        },
        {
          functionality: "NOTIFICATION_CREATE",
          status: "OK",
          startDate: "2022-10-21T06:07:15Z",
          endDate: "2022-10-21T06:07:17Z",
          fileAvailable: false,
        },
        {
          functionality: "NOTIFICATION_WORKFLOW",
          status: "KO",
          startDate: "2022-10-21T08:15:25Z",
        }
      ],
      nextPage: "some-next-page",
    };
    expect(new BEDowntimePageValidator().validate(downtimePage)).toBeNull(); 
  });

  it("downtime page validator - invalid page - ill-formed incident", () => {
    const downtimePage: any = {
      result: [
        {
          functionality: "NOTIFICATION_CREATE",
          status: "OK",
          startDate: "2022-10-21T06:07:08Z",
          endDate: "2022-10-21T06:07:12Z",
          legalFactId: "some-legal-fact-id",
          fileAvailable: true,
        },
        {
          functionality: 45,
          status: "OK",
          startDate: "2022-10-21T06:07:15Z",
          endDate: "2022-10-21T06:07:17Z",
          fileAvailable: false,
        },
        {
          functionality: "NOTIFICATION_WORKFLOW",
          status: "KO",
          startDate: "2022-10-21T08:15:25Z",
        }
      ],
      nextPage: "some-next-page",
    };
    const validationResult = new BEDowntimePageValidator().validate(downtimePage);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.result).not.toBeUndefined();
    expect(validationResult?.nextPage).toBeUndefined();
  });

  it("downtime page validator - invalid page - wrong-type nextPage", () => {
    const downtimePage: any = {
      result: [
        {
          functionality: "NOTIFICATION_CREATE",
          status: "OK",
          startDate: "2022-10-21T06:07:08Z",
          endDate: "2022-10-21T06:07:12Z",
          legalFactId: "some-legal-fact-id",
          fileAvailable: true,
        },
        {
          functionality: "NOTIFICATION_WORKFLOW",
          status: "KO",
          startDate: "2022-10-21T08:15:25Z",
        }
      ],
      nextPage: {a: 4, b: 28},
    };
    const validationResult = new BEDowntimePageValidator().validate(downtimePage);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.result).toBeUndefined();
    expect(validationResult?.nextPage).not.toBeUndefined();
  });

});