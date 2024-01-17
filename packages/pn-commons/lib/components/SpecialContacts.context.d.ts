import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
interface ISpecialContactsContext {
    contextEditMode: boolean;
    setContextEditMode: Dispatch<SetStateAction<boolean>>;
}
declare const SpecialContactsProvider: FC<ReactNode>;
declare const useSpecialContactsContext: () => ISpecialContactsContext;
export { SpecialContactsProvider, useSpecialContactsContext };
