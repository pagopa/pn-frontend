import {
  parsedEmptyResponseMock,
  parsedResponseMock,
  rawResponseMock,
} from '../../../__mocks__/Statistics.mock';
import { StatisticsDataTypes } from '../../../models/Statistics';
import { LastStateStatisticsData } from '../LastStateStatisticsData';
import StatisticsDataFactory from '../StatisticsDataFactory';

describe('LastStateStatisticsData', () => {
  const statisticsDataFactory = new StatisticsDataFactory();
  const instance = statisticsDataFactory.create(
    StatisticsDataTypes.LastStateStatistics
  ) as LastStateStatisticsData;

  it('returns the class name', () => {
    const className = instance.getName();
    expect(className).toStrictEqual(StatisticsDataTypes.LastStateStatistics);
  });

  it('parses full response data and resets properly', () => {
    const initialData = instance.getData(); // get initial empty data
    const initialDataMock = parsedEmptyResponseMock.data[StatisticsDataTypes.LastStateStatistics];

    // checks initial data is empty
    expect(initialData).toStrictEqual(initialDataMock);

    // checks the parse method populates data as expected
    instance.parse(rawResponseMock);
    const parsedData = instance.getData();
    expect(parsedData).toStrictEqual(
      parsedResponseMock.data[StatisticsDataTypes.LastStateStatistics]
    );

    // resets data
    instance.resetData();
    expect(instance.getData()).toStrictEqual(initialDataMock);
  });
});
