import "@babel/polyfill";
import { metaSPA } from "../index";

metaSPA
    .register({
        namespace: "TestReact",
        entry: "/public/bundle.js",
        providers: [
            { symbol: "React", module: () => import("react") },
            { symbol: "ReactDOM", module: () => import("react-dom") },
        ],
        onLoad: (module, context) => {
            const Root = module.default;
            const React = context.providers.React;
            const ReactDOM = context.providers.ReactDOM;
            ReactDOM.render(<Root />, document.getElementById("root"));
        },
    })
    .loadModule("TestReact");
