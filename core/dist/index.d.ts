type IMetaSPAProvider<P extends {
    [x: string]: any;
}> = {
    [K in keyof P]?: P[K];
} & {
    MetaSPA: MetaSPACore<P>;
};
interface IMetaRegistration<P extends {
    [x: string]: any;
}> {
    namespace: string;
    entry: string;
    providers: Array<{
        symbol: keyof IMetaSPAProvider<P>;
        module: () => any;
    }>;
    onLoad: (module: any, context: MetaSPACore<P>) => any;
    unMount: (module: any, context: MetaSPACore<P>) => any;
}
type IMetaSPALoadFunction = (config: {
    namespace: string;
}) => (module: any) => Promise<void>;
declare class MetaSPACore<P extends {
    [x: string]: any;
}> {
    static getInstance: () => MetaSPACore<any>;
    providers: IMetaSPAProvider<P>;
    registeredModules: {
        [x: string]: any;
    };
    metaSPALoad: IMetaSPALoadFunction;
    registrations: Map<string, IMetaRegistration<P>>;
    register<T extends {
        [x: string]: any;
    }>(config: IMetaRegistration<T>): this;
    private _loadModuleAsync;
    loadModule(namespace: string): this;
    private _unMountModuleAsync;
    unMountModule(namespace: string): this;
}
declare global {
    interface Window {
        metaSPA: MetaSPACore<any>;
        metaSPALoad: IMetaSPALoadFunction;
        metaSPAProvider: IMetaSPAProvider<any>;
    }
}
declare const metaSPA: MetaSPACore<any>;
export default MetaSPACore;
export { metaSPA };
