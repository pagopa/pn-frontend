import StatisticsDataFactory from './StatisticsDataFactory';

class StatisticsDataFactoryManager {
  private innerFactory: StatisticsDataFactory = new StatisticsDataFactory();

  public get factory(): StatisticsDataFactory {
    return this.innerFactory;
  }

  public set factory(factory: StatisticsDataFactory) {
    // eslint-disable-next-line functional/immutable-data
    this.innerFactory = factory;
  }
}

const statisticsDataFactoryManager = new StatisticsDataFactoryManager();

export default statisticsDataFactoryManager;
