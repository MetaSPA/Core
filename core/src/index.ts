import scriptjs from "scriptjs";
import * as MetaSPA from "./index";

export interface IDictionaryType {
    [x: string]: any;
}

export type IMetaSPAProvider<P extends IDictionaryType> = {
    [K in keyof P]?: P[K]
} & {
    MetaSPA: MetaSPACore<P>;
};

export interface IMetaRegistration<P extends IDictionaryType> {
    namespace: string;
    entries: string | string[];
    providers: Array<{
        symbol: keyof IMetaSPAProvider<P>;
        module: () => any;
    }>;
    onLoad: (module: any, context: MetaSPACore<P>) => any;
    unMount: (module: any, context: MetaSPACore<P>) => any;
}

export type IMetaSPALoadFunction = (
    config: { namespace: string; modules: any },
) => Promise<void>;

class MetaSPACore<P extends IDictionaryType> {
    static getInstance = () => {
        if (!window.metaSPA) {
            window.metaSPA = new MetaSPACore();
            window.metaSPALoad = window.metaSPA.metaSPALoad;
            window.metaSPAProvider = window.metaSPA.providers;
        }
        return window.metaSPA;
    };
    public runTime: IDictionaryType = {}; // used for storing general global data
    public providers: IMetaSPAProvider<P> = {} as IMetaSPAProvider<P>;
    public registeredModules: IDictionaryType = {};
    public metaSPALoad: IMetaSPALoadFunction = async config => {
        const { namespace, modules } = config;
        this.registeredModules[namespace] = modules;
        const registration = this.registrations[namespace]!;
        registration.onLoad(this.registeredModules[namespace], this);
    };
    public registrations: { [x: string]: IMetaRegistration<P> } = {};
    public register<T extends IDictionaryType>(config: IMetaRegistration<T>) {
        const { namespace } = config;
        config.providers.push({ symbol: "MetaSPA", module: () => MetaSPA });
        this.registrations[namespace] = config as IMetaRegistration<any>;
        return this;
    }
    private async _loadModuleAsync(namespace: string) {
        const module = this.registrations[namespace];
        if (module) {
            if (this.registeredModules[namespace]) {
                module.onLoad(this.registeredModules[namespace], this);
                return;
            } else {
                const promises = module.providers.map(async p => {
                    this.providers[p.symbol as string] = await p.module();
                });
                await Promise.all(promises);

                const entries = Array.isArray(module.entries)
                    ? module.entries
                    : [module.entries];
                entries.forEach(s => scriptjs(s, () => {}));
            }
        }
    }
    public loadModule(namespace: string) {
        this._loadModuleAsync(namespace);
        return this;
    }
    private async _unMountModuleAsync(namespace: string) {
        const module = this.registrations[namespace];
        if (module) {
            await module.unMount(this.registeredModules[namespace], this);
        }
    }
    public unMountModule(namespace: string) {
        this._unMountModuleAsync(namespace);
        return this;
    }
}

declare global {
    interface Window {
        metaSPA: MetaSPACore<any>;
        metaSPALoad: IMetaSPALoadFunction;
        metaSPAProvider: IMetaSPAProvider<any>;
    }
}

const metaSPA = MetaSPACore.getInstance();
export default MetaSPACore;
export { metaSPA };
