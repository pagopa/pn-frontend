import AppError from '../AppError';
declare class GenericAppErrorFactory {
    static create(status: number | string): AppError;
}
export default GenericAppErrorFactory;
