// import * as React from "react";
import * as ReactDOM from "react-dom";
declare module "../core/provider" {
    interface IMetaSPAProvider {
        React: any;
        ReactDOM: ReactDOM;
    }
}
