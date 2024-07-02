import {
  parsedEmptyResponseMock,
  parsedResponseMock,
  rawResponseMock,
} from '../../../__mocks__/Statistics.mock';
import { StatisticsDataTypes } from '../../../models/Statistics';
import { FiledStatisticsData } from '../FiledStatisticsData';
import StatisticsDataFactory from '../StatisticsDataFactory';

describe('FiledStatisticsData', () => {
  const statisticsDataFactory = new StatisticsDataFactory();
  const instance = statisticsDataFactory.create(
    StatisticsDataTypes.FiledStatistics
  ) as FiledStatisticsData;

  it('returns the class name', () => {
    const className = instance.getName();
    expect(className).toStrictEqual(StatisticsDataTypes.FiledStatistics);
  });

  it('parses full response data and resets properly', () => {
    const initialData = instance.getData(); // get initial empty data
    const initialDataMock = parsedEmptyResponseMock.data[StatisticsDataTypes.FiledStatistics];

    // checks initial data is empty
    expect(initialData).toStrictEqual(initialDataMock);

    // checks the parse method populates data as expected
    instance.parse(rawResponseMock);
    const parsedData = instance.getData();
    expect(parsedData).toStrictEqual(parsedResponseMock.data[StatisticsDataTypes.FiledStatistics]);

    // resets data
    instance.resetData();
    expect(instance.getData()).toStrictEqual(initialDataMock);
  });
});
