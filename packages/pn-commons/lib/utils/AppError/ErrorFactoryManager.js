import AppErrorFactory from "./AppErrorFactory";
class ErrorFactoryManager {
    constructor() {
        this.innerFactory = new AppErrorFactory();
    }
    get factory() { return this.innerFactory; }
    set factory(factory) {
        // eslint-disable-next-line functional/immutable-data
        this.innerFactory = factory;
    }
}
const errorFactoryManager = new ErrorFactoryManager();
export default errorFactoryManager;
