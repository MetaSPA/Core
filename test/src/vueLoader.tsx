import { Component, h } from "preact";
import { metaSPA } from "../../core/dist";
import { RouteComponentProps } from "./router";

const loadManifest = async () => {
    const result = await fetch("/vue/public/manifest.json");
    const entryMap = await result.json();
    return Object.entries<string>(entryMap).map<string>(
        ([key, value]) => value,
    );
};

class VueLoader extends Component<RouteComponentProps, any> {
    private ref: HTMLDivElement | null = null;
    private child: any;
    register = async () => {
        const entries = await loadManifest();
        metaSPA
            .register({
                namespace: "TestVue",
                entries,
                providers: [{ symbol: "Vue", module: () => import("vue") }],
                onLoad: (module, context) => {
                    const { App, router, store } = module;
                    const Vue = context.providers.Vue!.default;
                    this.child = new Vue({
                        router,
                        store,
                        render: (h: any) => h(App),
                    }).$mount();
                    this.ref!.appendChild(this.child.$el);
                },
                unMount: () => {
                    this.ref!.removeChild(this.child.$el);
                    this.child.$destroy();
                },
            })
            .loadModule("TestVue");
    };
    componentDidMount() {
        this.register();
    }
    componentWillUnmount() {
        metaSPA.unMountModule("TestVue");
    }
    render() {
        return <div ref={div => (this.ref = div)} />;
    }
}

export default VueLoader;
