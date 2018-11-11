import MetaSPACore from "core";

declare global {
    interface Window {
        metaSPA: MetaSPACore;
        metaSPALoad: typeof MetaSPACore["metaSPALoad"];
        metaSPAProvider: typeof MetaSPACore["metaSPAProvider"];
    }
}
