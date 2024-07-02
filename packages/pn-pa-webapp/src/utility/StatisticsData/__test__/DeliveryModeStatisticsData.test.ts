import {
  parsedEmptyResponseMock,
  parsedResponseMock,
  rawResponseMock,
} from '../../../__mocks__/Statistics.mock';
import { StatisticsDataTypes } from '../../../models/Statistics';
import { DeliveryModeStatisticsData } from '../DeliveryModeStatisticsData';
import StatisticsDataFactory from '../StatisticsDataFactory';

describe('DeliveryModeStatisticsData', () => {
  const statisticsDataFactory = new StatisticsDataFactory();
  const instance = statisticsDataFactory.create(
    StatisticsDataTypes.DeliveryModeStatistics
  ) as DeliveryModeStatisticsData;

  it('returns the class name', () => {
    const className = instance.getName();
    expect(className).toStrictEqual(StatisticsDataTypes.DeliveryModeStatistics);
  });

  it('parses full response data and resets properly', () => {
    const initialData = instance.getData(); // get initial empty data
    const initialDataMock =
      parsedEmptyResponseMock.data[StatisticsDataTypes.DeliveryModeStatistics];

    // checks initial data is empty
    expect(initialData).toStrictEqual(initialDataMock);

    // checks the parse method populates data as expected
    instance.parse(rawResponseMock);
    const parsedData = instance.getData();
    expect(parsedData).toStrictEqual(
      parsedResponseMock.data[StatisticsDataTypes.DeliveryModeStatistics]
    );

    // resets data
    instance.resetData();
    expect(instance.getData()).toStrictEqual(initialDataMock);
  });
});
