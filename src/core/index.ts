import scriptjs from "scriptjs";
import { IMetaSPAProvider } from "./provider";
import * as MetaSPA from "./index";

interface IMetaRegistration {
    namespace: string;
    entry: string;
    providers: Array<{
        symbol: keyof IMetaSPAProvider;
        module: () => any;
    }>;
    onLoad: (module: any, context: MetaSPACore) => any;
}

class MetaSPACore {
    static metaSPAProvider: IMetaSPAProvider = {} as IMetaSPAProvider;
    static registeredModules: { [x: string]: any } = {};
    static metaSPALoad = (config: {
        namespace: string;
    }) => async (module: any) => {
        MetaSPACore.registeredModules[config.namespace] = module;
    };
    static getInstance = () => {
        if (!window.metaSPA) {
            window.metaSPA = new MetaSPACore();
        }
        return window.metaSPA;
    };
    private registrations = new Map<string, IMetaRegistration>();

    public register(config: IMetaRegistration) {
        const { namespace } = config;
        config.providers.push({ symbol: "MetaSPA", module: () => MetaSPA });
        this.registrations.set(namespace, config);
        return this;
    }
    get providers() {
        return MetaSPACore.metaSPAProvider;
    }

    get registeredSPA() {
        return MetaSPACore.registeredModules;
    }

    private async _loadModuleAsync(namespace: string) {
        const context = this;
        const module = this.registrations.get(namespace);
        if (module) {
            const promises = module.providers.map(async p => {
                MetaSPACore.metaSPAProvider[p.symbol] = await p.module();
            });
            await Promise.all(promises);
            scriptjs("/public/bundle.js", () => {
                module.onLoad(MetaSPACore.registeredModules[namespace], context);
            });
        }
    }
    public loadModule(namespace: string) {
        this._loadModuleAsync(namespace);
        return this;
    }
}

window.metaSPALoad = MetaSPACore.metaSPALoad;
window.metaSPAProvider = MetaSPACore.metaSPAProvider;

const metaSPA = MetaSPACore.getInstance();

export default MetaSPACore;
export { metaSPA };
