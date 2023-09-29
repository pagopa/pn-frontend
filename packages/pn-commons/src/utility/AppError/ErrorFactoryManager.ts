import AppErrorFactory from "./AppErrorFactory";

class ErrorFactoryManager {
  private innerFactory: AppErrorFactory = new AppErrorFactory();
  
  public get factory(): AppErrorFactory { return this.innerFactory; }
  
  public set factory(factory: AppErrorFactory) {
    // eslint-disable-next-line functional/immutable-data
    this.innerFactory = factory;
  }
}

const errorFactoryManager = new ErrorFactoryManager();

export default errorFactoryManager;