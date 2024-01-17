import GenericAppErrorFactory from './GenericAppError/GenericAppErrorFactory';
import UnknownAppError from './UnknownAppError';
class AppErrorFactory {
    constructor() {
        this.getCustomError = (error) => new UnknownAppError(error);
    }
    create(error) {
        if (typeof error !== 'object') {
            return GenericAppErrorFactory.create(error);
        }
        return this.getCustomError(error);
    }
}
export default AppErrorFactory;
