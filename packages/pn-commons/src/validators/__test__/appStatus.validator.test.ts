import {
  AppCurrentStatus,
  Downtime,
  DowntimeLogHistory,
  DowntimeStatus,
  KnownFunctionality,
} from '../../models/AppStatus';
import {
  AppStatusDTOValidator,
  BEDowntimeValidator,
  DowntimeLogHistoryDTOValidator,
} from '../appStatus.validator';

describe('App Status model test', () => {
  it('downtime validator - minimal valid downtime', () => {
    const downtime: Downtime = {
      functionality: KnownFunctionality.NotificationCreate,
      status: DowntimeStatus.OK,
      startDate: '2022-10-21T06:07:08Z',
    };

    expect(new BEDowntimeValidator().validate(downtime)).toBeNull();
  });

  it('downtime validator - valid downtime with full data', () => {
    const downtime: Downtime = {
      functionality: KnownFunctionality.NotificationCreate,
      status: DowntimeStatus.OK,
      startDate: '2022-10-21T06:07:08Z',
      endDate: '2022-10-21T06:07:05Z',
      legalFactId: 'some-id',
      fileAvailable: true,
    };

    expect(new BEDowntimeValidator().validate(downtime)).toBeNull();
  });

  it('downtime validator - bad status', () => {
    const downtime: Downtime = {
      functionality: KnownFunctionality.NotificationCreate,
      status: 'INVALID_STATUS' as DowntimeStatus,
      startDate: '2022-10-21T06:07:08Z',
    };

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.status).not.toBeUndefined();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
  });

  it('downtime validator - missing functionality', () => {
    const downtime: Downtime = {
      status: 'OK',
      startDate: '2022-10-21T06:07:08Z',
    } as Downtime;

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).not.toBeUndefined();
    expect(validationResult?.status).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
  });

  it('downtime validator - bad-typed data', () => {
    const downtime: any = {
      functionality: true,
      status: 4,
      startDate: '2022-10-21T06:07:08Z',
      fileAvailable: 'toto',
    };

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.functionality).not.toBeUndefined();
    expect(validationResult?.status).not.toBeUndefined();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).toBeUndefined();
    expect(validationResult?.fileAvailable).not.toBeUndefined();
  });

  it('downtime validator - just bad-typed legalFactId', () => {
    const downtime: any = {
      functionality: 'NOTIFICATION_CREATE',
      status: 'OK',
      startDate: '2022-10-21T06:07:08Z',
      endDate: '2022-10-21T06:07:05Z',
      legalFactId: { a: 3, b: 'hello' },
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

  it('downtime validator - ill-formed start date', () => {
    const downtime: Downtime = {
      functionality: KnownFunctionality.NotificationWorkflow,
      status: DowntimeStatus.KO,
      startDate: 'not-a-date',
      endDate: '2022-10-21T06:07:05Z',
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

  it('downtime validator - ill-formed end date', () => {
    const downtime: Downtime = {
      functionality: KnownFunctionality.NotificationWorkflow,
      status: DowntimeStatus.KO,
      startDate: '2022-10-21T06:07:05Z',
      endDate: '2022-99-21T06:07:05Z',
      fileAvailable: true,
    };

    const validationResult = new BEDowntimeValidator().validate(downtime);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.startDate).toBeUndefined();
    expect(validationResult?.endDate).not.toBeUndefined();
  });

  it('status validator - valid data with no open incidents', () => {
    const status: AppCurrentStatus = {
      appIsFullyOperative: true,
      lastCheckTimestamp: new Date().toISOString(),
    };
    expect(new AppStatusDTOValidator().validate(status)).toBeNull();
  });

  it('status validator - valid data with open incidents', () => {
    const status: AppCurrentStatus = {
      appIsFullyOperative: false,
      lastCheckTimestamp: new Date().toISOString(),
    };
    expect(new AppStatusDTOValidator().validate(status)).toBeNull();
  });

  it('status validator - wrong appIsFullyOperative type', () => {
    const status: any = {
      appIsFullyOperative: 'ciao',
      lastCheckTimestamp: new Date().toISOString(),
    };
    const validationResult = new AppStatusDTOValidator().validate(status);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.appIsFullyOperative).not.toBeUndefined();
    expect(validationResult?.lastCheckTimestamp).toBeUndefined();
  });

  it('status validator - bad-typed last check date', () => {
    const status: AppCurrentStatus = {
      appIsFullyOperative: true,
      lastCheckTimestamp: '2022-10-99T06:07:08Z',
    };
    const validationResult = new AppStatusDTOValidator().validate(status);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.appIsFullyOperative).toBeUndefined();
    expect(validationResult?.lastCheckTimestamp).not.toBeUndefined();
  });

  it('downtime page validator - valid page with no downtime events', () => {
    const downtimeLogPage: DowntimeLogHistory = {
      result: [],
    };
    expect(new DowntimeLogHistoryDTOValidator().validate(downtimeLogPage)).toBeNull();
  });

  it('downtime page validator - valid page with three downtime events', () => {
    const downtimeLogPage: DowntimeLogHistory = {
      result: [
        {
          functionality: KnownFunctionality.NotificationCreate,
          status: DowntimeStatus.OK,
          startDate: '2022-10-21T06:07:08Z',
          endDate: '2022-10-21T06:07:12Z',
          legalFactId: 'some-legal-fact-id',
          fileAvailable: true,
        },
        {
          functionality: KnownFunctionality.NotificationCreate,
          status: DowntimeStatus.OK,
          startDate: '2022-10-21T06:07:15Z',
          endDate: '2022-10-21T06:07:17Z',
          fileAvailable: false,
        },
        {
          functionality: KnownFunctionality.NotificationWorkflow,
          status: DowntimeStatus.KO,
          startDate: '2022-10-21T08:15:25Z',
        },
      ],
      nextPage: 'some-next-page',
    };
    expect(new DowntimeLogHistoryDTOValidator().validate(downtimeLogPage)).toBeNull();
  });

  it('downtime page validator - invalid page - ill-formed downtime', () => {
    const downtimeLogPage: any = {
      result: [
        {
          functionality: KnownFunctionality.NotificationCreate,
          status: DowntimeStatus.OK,
          startDate: '2022-10-21T06:07:08Z',
          endDate: '2022-10-21T06:07:12Z',
          legalFactId: 'some-legal-fact-id',
          fileAvailable: true,
        },
        {
          functionality: 45,
          status: DowntimeStatus.OK,
          startDate: '2022-10-21T06:07:15Z',
          endDate: '2022-10-21T06:07:17Z',
          fileAvailable: false,
        },
        {
          functionality: KnownFunctionality.NotificationWorkflow,
          status: DowntimeStatus.KO,
          startDate: '2022-10-21T08:15:25Z',
        },
      ],
      nextPage: 'some-next-page',
    };
    const validationResult = new DowntimeLogHistoryDTOValidator().validate(downtimeLogPage);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.result).not.toBeUndefined();
    expect(validationResult?.nextPage).toBeUndefined();
  });

  it('downtime page validator - invalid page - wrong-type nextPage', () => {
    const downtimeLogPage: any = {
      result: [
        {
          functionality: KnownFunctionality.NotificationCreate,
          status: DowntimeStatus.OK,
          startDate: '2022-10-21T06:07:08Z',
          endDate: '2022-10-21T06:07:12Z',
          legalFactId: 'some-legal-fact-id',
          fileAvailable: true,
        },
        {
          functionality: KnownFunctionality.NotificationWorkflow,
          status: DowntimeStatus.KO,
          startDate: '2022-10-21T08:15:25Z',
        },
      ],
      nextPage: { a: 4, b: 28 },
    };
    const validationResult = new DowntimeLogHistoryDTOValidator().validate(downtimeLogPage);
    expect(validationResult).not.toBeNull();
    expect(validationResult?.result).toBeUndefined();
    expect(validationResult?.nextPage).not.toBeUndefined();
  });
});
