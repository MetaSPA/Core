import { Component, h } from "preact";
import { metaSPA } from "../../core/dist";

class VueLoader extends Component<{}, any> {
    private ref: HTMLDivElement | null = null;
    private child: any
    componentDidMount() {
        metaSPA
            .register({
                namespace: "TestVue",
                // entry: "/vuepublic/testvue.common.js",
                entry: '/vue2public/app.js',
                providers: [{ symbol: "Vue", module: () => import("vue") }],
                onLoad: (module, context) => {
                    const {App, router, store} = module;
                    const Vue = context.providers.Vue!.default;
                    this.child = new Vue({
                        router,
                        store,
                        render: (h: any) => h(App),
                    }).$mount()
                    this.ref!.appendChild(this.child.$el)
                },
                unMount: () => {
                    this.ref!.removeChild(this.child.$el)
                    this.child.$destroy()
                },
            })
            .loadModule("TestVue");
    }
    componentWillUnmount() {
        metaSPA.unMountModule("TestVue");
    }
    render() {
        return <div ref={div => (this.ref = div)} />;
    }
}

export default VueLoader;
