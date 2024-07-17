import {
  parsedEmptyResponseMock,
  parsedResponseMock,
  rawResponseMock,
} from '../../../__mocks__/Statistics.mock';
import { StatisticsDataTypes } from '../../../models/Statistics';
import { DigitalMeanTimeStatisticsData } from '../DigitalMeanTimeStatisticsData';
import StatisticsDataFactory from '../StatisticsDataFactory';

describe('DigitalMeanTimeStatisticsData', () => {
  const statisticsDataFactory = new StatisticsDataFactory();
  const instance = statisticsDataFactory.create(
    StatisticsDataTypes.DigitalMeanTimeStatistics
  ) as DigitalMeanTimeStatisticsData;

  it('returns the class name', () => {
    const className = instance.getName();
    expect(className).toStrictEqual(StatisticsDataTypes.DigitalMeanTimeStatistics);
  });

  it('parses full response data and resets properly', () => {
    const initialData = instance.getData(); // get initial empty data
    const initialDataMock =
      parsedEmptyResponseMock.data[StatisticsDataTypes.DigitalMeanTimeStatistics];

    // checks initial data is empty
    expect(initialData).toStrictEqual(initialDataMock);

    // checks the parse method populates data as expected
    instance.parse(rawResponseMock);
    const parsedData = instance.getData();
    expect(parsedData).toStrictEqual(
      parsedResponseMock.data[StatisticsDataTypes.DigitalMeanTimeStatistics]
    );

    // resets data
    instance.resetData();
    expect(instance.getData()).toStrictEqual(initialDataMock);
  });
});
