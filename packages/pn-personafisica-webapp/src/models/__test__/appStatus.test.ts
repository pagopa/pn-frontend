import { BEIncident, BEIncidentValidator, BEStatus, BEStatusValidator } from "../appStatus";

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
});