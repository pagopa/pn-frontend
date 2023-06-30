import { DowntimeLogPageDTO, DowntimeLogPageDTOValidator, DowntimeDTO, BEDowntimeValidator, AppStatusDTO, AppStatusDTOValidator } from "../appStatus";

describe("App Status model test", () => {
  it("downtime validator - minimal valid downtime", () => {
    const downtime: DowntimeDTO = {
      functionality: "NOTIFICATION_CREATE",
      status: "OK",
      startDate: "2022-10-21T06:07:08Z",
    };

    expect(new BEDowntimeValidator().validate(downtime)).toBeNull();
  });

  it("downtime validator - valid downtime with full data", () => {
    const downtime: DowntimeDTO = {
      functionality: "NOTIFICATION_CREATE",
      status: "KO",
      startDate: "2022-10-21T06:07:08Z",
      endDate: "2022-10-21T06:07:05Z",
      legalFactId: "some-id",
      fileAvailable: true,
    };

    expect(new BEDowntimeValidator().validate(downtime)).toBeNull();
  });

  it("downtime validator - bad status", () => {
    const downtime: DowntimeDTO = {
      functionality: "NOTIFICATION_CREATE",
      status: "INVALID_STATUS",
      startDate: "2022-10-21T06:07:08Z",
    };

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.status).not.toBeUndefined();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
  });

  it("downtime validator - missing functionality", () => {
    const downtime: any = {
      status: "OK",
      startDate: "2022-10-21T06:07:08Z",
    };

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).not.toBeUndefined();
    expect(validationResult?.status).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
  });

  it("downtime validator - bad-typed data", () => {
    const downtime: any = {
      functionality: true,
      status: 4,
      startDate: "2022-10-21T06:07:08Z",
      fileAvailable: "toto",
    };

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).not.toBeUndefined();
    expect(validationResult?.status).not.toBeUndefined();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
    expect(validationResult?.fileAvailable).not.toBeUndefined();
  });

  it("downtime validator - just bad-typed legalFactId", () => {
    const downtime: any = {
      functionality: "NOTIFICATION_CREATE",
      status: "OK",
      startDate: "2022-10-21T06:07:08Z",
      endDate: "2022-10-21T06:07:05Z",
      legalFactId: {a: 3, b: "hello"},
      fileAvailable: true,
    };

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).toBeUndefined();
    expect(validationResult?.status).toBeUndefined();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
    expect(validationResult?.legalFactId).not.toBeUndefined();
    expect(validationResult?.fileAvailable).toBeUndefined();
  });

  it("downtime validator - ill-formed start date", () => {
    const downtime: DowntimeDTO = {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: "not-a-date",
      endDate: "2022-10-21T06:07:05Z",
      fileAvailable: true,
    };

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).toBeUndefined();
    expect(validationResult?.status).toBeUndefined();
    expect(validationResult?.startDate).not.toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
    expect(validationResult?.fileAvailable).toBeUndefined();
  });

  it("downtime validator - ill-formed end date", () => {
    const downtime: DowntimeDTO = {
      functionality: "NOTIFICATION_WORKFLOW",
      status: "KO",
      startDate: "2022-10-21T06:07:05Z",
      endDate: "2022-99-21T06:07:05Z",
      fileAvailable: true,
    };

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).not.toBeUndefined();
  });

  it("status validator - valid data with no open incidents", () => {
    const status: AppStatusDTO = {
      functionalities: ["NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZATION", "NOTIFICATION_WORKFLOW"],
      openIncidents: [],
    }
    expect(new AppStatusDTOValidator().validate(status)).toBeNull();
  });

  it("status validator - valid data with two open incidents", () => {
    const status: AppStatusDTO = {
      functionalities: ["NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZATION", "NOTIFICATION_WORKFLOW"],
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
    expect(new AppStatusDTOValidator().validate(status)).toBeNull();
  });

  it("status validator - empty list of functionalities", () => {
    const status: AppStatusDTO = {
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
    const validationResult = new AppStatusDTOValidator().validate(status);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionalities).not.toBeUndefined();
    expect(validationResult?.openIncidents).toBeUndefined();
  });

  it("status validator - bad-typed start date in one open incident", () => {
    const status: AppStatusDTO = {
      functionalities: ["NOTIFICATION_CREATE", "NOTIFICATION_VISUALIZATION", "NOTIFICATION_WORKFLOW"],
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
    const validationResult = new AppStatusDTOValidator().validate(status);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionalities).toBeUndefined();
    expect(validationResult?.openIncidents).not.toBeUndefined();
  });

  it("downtime page validator - valid page with no downtime events", () => {
    const downtimeLogPage: DowntimeLogPageDTO = {
      result: [],
    };
    expect(new DowntimeLogPageDTOValidator().validate(downtimeLogPage)).toBeNull(); 
  });

  it("downtime page validator - valid page with three downtime events", () => {
    const downtimeLogPage: DowntimeLogPageDTO = {
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
    expect(new DowntimeLogPageDTOValidator().validate(downtimeLogPage)).toBeNull(); 
  });

  it("downtime page validator - invalid page - ill-formed downtime", () => {
    const downtimeLogPage: any = {
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
    const validationResult = new DowntimeLogPageDTOValidator().validate(downtimeLogPage);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.result).not.toBeUndefined();
    expect(validationResult?.nextPage).toBeUndefined();
  });

  it("downtime page validator - invalid page - wrong-type nextPage", () => {
    const downtimeLogPage: any = {
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
    const validationResult = new DowntimeLogPageDTOValidator().validate(downtimeLogPage);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.result).toBeUndefined();
    expect(validationResult?.nextPage).not.toBeUndefined();
  });

});