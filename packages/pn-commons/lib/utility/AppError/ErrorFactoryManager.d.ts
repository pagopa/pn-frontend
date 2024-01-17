import AppErrorFactory from "./AppErrorFactory";
declare class ErrorFactoryManager {
    private innerFactory;
    get factory(): AppErrorFactory;
    set factory(factory: AppErrorFactory);
}
declare const errorFactoryManager: ErrorFactoryManager;
export default errorFactoryManager;
