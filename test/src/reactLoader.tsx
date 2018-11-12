import { Component, h } from "preact";
import { metaSPA } from "../../core/dist";

interface IReactLoaderProps {
    id: string;
}

class ReactLoader extends Component<IReactLoaderProps, any> {
    private ref: HTMLDivElement | null = null;
    componentDidMount() {
        metaSPA
            .register({
                namespace: "TestReact",
                entry: "/public/bundle.js",
                providers: [
                    { symbol: "React", module: () => import("react" as any) },
                    { symbol: "ReactDOM", module: () => import("react-dom" as any) },
                ],
                onLoad: (module, context) => {
                    const Root = module.default;
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
    }
    componentWillUnmount() {
        metaSPA.unMountModule("TestReact");
    }
    render() {
        return <div id={this.props.id} ref={div => (this.ref = div)} />;
    }
}

export default ReactLoader;
