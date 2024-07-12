import {
  parsedEmptyResponseMock,
  parsedResponseMock,
  rawResponseMock,
} from '../../../__mocks__/Statistics.mock';
import { StatisticsDataTypes } from '../../../models/Statistics';
import { DigitalErrorsDetailStatisticsData } from '../DigitalErrorsDetailStatisticsData';
import StatisticsDataFactory from '../StatisticsDataFactory';

describe('DigitalErrorsDetailStatisticsData', () => {
  const statisticsDataFactory = new StatisticsDataFactory();
  const instance = statisticsDataFactory.create(
    StatisticsDataTypes.DigitalErrorsDetailStatistics
  ) as DigitalErrorsDetailStatisticsData;

  it('returns the class name', () => {
    const className = instance.getName();
    expect(className).toStrictEqual(StatisticsDataTypes.DigitalErrorsDetailStatistics);
  });

  it('parses full response data and resets properly', () => {
    const initialData = instance.getData(); // get initial empty data
    const initialDataMock =
      parsedEmptyResponseMock.data[StatisticsDataTypes.DigitalErrorsDetailStatistics];

    // checks initial data is empty
    expect(initialData).toStrictEqual(initialDataMock);

    // checks the parse method populates data as expected
    instance.parse(rawResponseMock);
    const parsedData = instance.getData();
    expect(parsedData).toStrictEqual(
      parsedResponseMock.data[StatisticsDataTypes.DigitalErrorsDetailStatistics]
    );

    // resets data
    instance.resetData();
    expect(instance.getData()).toStrictEqual(initialDataMock);
  });
});
