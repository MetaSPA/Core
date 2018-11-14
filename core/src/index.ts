import scriptjs from "scriptjs";
import * as MetaSPA from "./index";
// import { createBrowserHistory, History } from "history";

type IMetaSPAProvider<P extends { [x: string]: any }> = {
    [K in keyof P]?: P[K]
} & {
    MetaSPA: MetaSPACore<P>;
};

interface IMetaRegistration<P extends { [x: string]: any }> {
    namespace: string;
    entry: string;
    providers: Array<{
        symbol: keyof IMetaSPAProvider<P>;
        module: () => any;
    }>;
    onLoad: (module: any, context: MetaSPACore<P>) => any;
    unMount: (module: any, context: MetaSPACore<P>) => any;
}

type IMetaSPALoadFunction = (
    config: { namespace: string },
) => (module: any) => Promise<void>;

class MetaSPACore<P extends { [x: string]: any }> {
    static getInstance = () => {
        if (!window.metaSPA) {
            window.metaSPA = new MetaSPACore();
            window.metaSPALoad = window.metaSPA.metaSPALoad;
            window.metaSPAProvider = window.metaSPA.providers;
            // window.metaSPAHistory = window.metaSPA.history;
        }
        return window.metaSPA;
    };
    // public history = createBrowserHistory();
    public providers: IMetaSPAProvider<P> = {} as IMetaSPAProvider<P>;
    public registeredModules: { [x: string]: any } = {};
    public metaSPALoad: IMetaSPALoadFunction = config => async module => {
        MetaSPACore.getInstance().registeredModules[config.namespace] = module;
        const registration = this.registrations.get(config.namespace)!;
        registration.onLoad(MetaSPACore.getInstance().registeredModules[config.namespace], this);
    };
    public registrations = new Map<string, IMetaRegistration<P>>();
    public register<T extends { [x: string]: any }>(
        config: IMetaRegistration<T>,
    ) {
        const { namespace } = config;
        config.providers.push({ symbol: "MetaSPA", module: () => MetaSPA });
        this.registrations.set(namespace, config as IMetaRegistration<any>);
        return this;
    }
    private async _loadModuleAsync(namespace: string) {
        const module = this.registrations.get(namespace);
        if (module) {
            if (MetaSPACore.getInstance().registeredModules[namespace]) {
                module.onLoad(
                    MetaSPACore.getInstance().registeredModules[namespace],
                    this,
                );
                return;
            } else {
                const promises = module.providers.map(async p => {
                    MetaSPACore.getInstance().providers[
                        p.symbol as string
                    ] = await p.module();
                });
                await Promise.all(promises);
                scriptjs(module.entry, () => {
                    // module.onLoad(
                    //     MetaSPACore.getInstance().registeredModules[namespace],
                    //     this,
                    // );
                });
            }
        }
    }
    public loadModule(namespace: string) {
        this._loadModuleAsync(namespace);
        return this;
    }
    private async _unMountModuleAsync(namespace: string) {
        const module = this.registrations.get(namespace);
        if (module) {
            await module.unMount(
                MetaSPACore.getInstance().registeredModules[namespace],
                this,
            );
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
        // metaSPAHistory: History<any>;
    }
}

const metaSPA = MetaSPACore.getInstance();
// const history = metaSPA.history;
export default MetaSPACore;
// export { metaSPA, history };
export { metaSPA };
