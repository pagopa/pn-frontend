import StatisticsDataFactory from './StatisticsDataFactory';

/**
 * This class is responsible for creating and managing a single StatisticsDataFactory instance
 *
 * @class StatisticsDataFactoryManager
 * @typedef {StatisticsDataFactoryManager}
 */
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
