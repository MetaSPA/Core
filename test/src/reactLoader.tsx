import { Component, h } from "preact";
import { metaSPA } from "../../core/dist";
import { RouteComponentProps } from "./router";

interface IReactLoaderProps extends RouteComponentProps {
    id: string;
}

const loadManifest = async () => {
    const result = await fetch("/react/public/manifest.json");
    const entryMap = await result.json();
    return Object.entries<string>(entryMap).map<string>(
        ([key, value]) => value,
    );
};

class ReactLoader extends Component<IReactLoaderProps, any> {
    private ref: HTMLDivElement | null = null;
    register = async () => {
        const entries = await loadManifest();
        metaSPA
            .register({
                namespace: "TestReact",
                entries,
                providers: [
                    { symbol: "React", module: () => import("react" as any) },
                    {
                        symbol: "ReactDOM",
                        module: () => import("react-dom" as any),
                    },
                ],
                onLoad: (module, context) => {
                    const Root = module;
                    const React = context.providers.React;
                    const ReactDOM = context.providers.ReactDOM;
                    ReactDOM.render(React.createElement(Root), this.ref);
                    console.log("React Component Mounted");
                },
                unMount: (module, context) => {
                    const ReactDOM = context.providers.ReactDOM;
                    ReactDOM.unmountComponentAtNode(this.ref);
                    console.log("React Component UnMounted");
                },
            })
            .loadModule("TestReact");
    };
    componentDidMount() {
        this.register();
    }
    componentWillUnmount() {
        metaSPA.unMountModule("TestReact");
    }
    shouldComponentUpdate(prevProps: IReactLoaderProps) {
        if (this.props.location.pathname === prevProps.location.pathname)
            return false;
        return true;
    }
    render() {
        return <div id={this.props.id} ref={div => (this.ref = div)} />;
    }
}

export default ReactLoader;
