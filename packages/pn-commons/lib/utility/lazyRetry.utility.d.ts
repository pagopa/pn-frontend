import { ComponentType, LazyExoticComponent } from 'react';
export declare const lazyRetry: <T extends ComponentType<any>>(componentImport: () => Promise<{
    default: T;
}>) => LazyExoticComponent<T>;
