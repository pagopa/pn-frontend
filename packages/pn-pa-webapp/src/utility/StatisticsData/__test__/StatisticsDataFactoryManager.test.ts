import StatisticsDataFactory from '../StatisticsDataFactory';
import statisticsDataFactoryManager from '../StatisticsDataFactoryManager';

describe('StatisticsDataFactoryManager', () => {
  it('set and get factory', () => {
    const factory = new StatisticsDataFactory();
    statisticsDataFactoryManager.factory = factory;
    expect(statisticsDataFactoryManager.factory).toStrictEqual(factory);
  });
});
