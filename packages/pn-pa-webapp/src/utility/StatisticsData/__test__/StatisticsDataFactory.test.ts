import { parsedResponseMock, rawResponseMock } from '../../../__mocks__/Statistics.mock';
import { StatisticsDataTypes } from '../../../models/Statistics';
import { DeliveryModeStatisticsData } from '../DeliveryModeStatisticsData';
import { DigitalErrorsDetailStatisticsData } from '../DigitalErrorsDetailStatisticsData';
import { DigitalMeanTimeStatisticsData } from '../DigitalMeanTimeStatisticsData';
import { DigitalStateStatisticsData } from '../DigitalStateStatisticsData';
import { FiledStatisticsData } from '../FiledStatisticsData';
import { LastStateStatisticsData } from '../LastStateStatisticsData';
import StatisticsDataFactory from '../StatisticsDataFactory';

describe('StatisticsDataFactory', () => {
  const statisticsDataFactory = new StatisticsDataFactory();

  it('returns instance of DeliveryModeStatisticsData', () => {
    const currentClass = statisticsDataFactory.create(StatisticsDataTypes.DeliveryModeStatistics);
    expect(currentClass).toBeInstanceOf(DeliveryModeStatisticsData);
  });

  it('returns instance of DigitalErrorsDetailStatisticsData', () => {
    const currentClass = statisticsDataFactory.create(
      StatisticsDataTypes.DigitalErrorsDetailStatistics
    );
    expect(currentClass).toBeInstanceOf(DigitalErrorsDetailStatisticsData);
  });

  it('returns instance of DigitalMeanTimeStatisticsData', () => {
    const currentClass = statisticsDataFactory.create(
      StatisticsDataTypes.DigitalMeanTimeStatistics
    );
    expect(currentClass).toBeInstanceOf(DigitalMeanTimeStatisticsData);
  });

  it('returns instance of DigitalStateStatisticsData', () => {
    const currentClass = statisticsDataFactory.create(StatisticsDataTypes.DigitalStateStatistics);
    expect(currentClass).toBeInstanceOf(DigitalStateStatisticsData);
  });

  it('returns instance of FiledStatisticsData', () => {
    const currentClass = statisticsDataFactory.create(StatisticsDataTypes.FiledStatistics);
    expect(currentClass).toBeInstanceOf(FiledStatisticsData);
  });

  it('returns instance of LastStateStatisticsData', () => {
    const currentClass = statisticsDataFactory.create(StatisticsDataTypes.LastStateStatistics);
    expect(currentClass).toBeInstanceOf(LastStateStatisticsData);
  });

  it('returns null if passed a wrong type', () => {
    const currentClass = statisticsDataFactory.create('WrongStatisticsDataSubtype');
    expect(currentClass).toBeNull();
  });

  it('creates every StatisticsData concrete subtype', () => {
    const parsedData = statisticsDataFactory.createAll(rawResponseMock);
    expect(parsedData).toStrictEqual(parsedResponseMock.data);
  });
});
