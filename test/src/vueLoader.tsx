import { Component, h } from "preact";
import { metaSPA } from "../../core/dist";

class VueLoader extends Component<{}, any> {
    private ref: HTMLDivElement | null = null;
    private child: any
    componentDidMount() {
        metaSPA
            .register({
                namespace: "TestVue",
                entry: "/vuepublic/testvue.common.js",
                providers: [{ symbol: "Vue", module: () => import("vue") }],
                onLoad: (module, context) => {
                    const Root = module;
                    const Vue = context.providers.Vue!.default;
                    this.child = new Vue({
                        render: (h: any) => h(Root),
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
