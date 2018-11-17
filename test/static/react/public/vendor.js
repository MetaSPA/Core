(window["metaSPAJsonpTestReact"] = window["metaSPAJsonpTestReact"] || []).push([["vendor"],{

/***/ "../node_modules/@metaspa/module/dist/index.js":
/*!*****************************************************!*\
  !*** ../node_modules/@metaspa/module/dist/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metaSPA = window.metaSPA;
exports.metaSPA = metaSPA;
var bootstrap = function (config) {
    if (!window.metaSPA) {
        throw new Error("You are not running without any MetaSPA provider");
    }
    window.metaSPA.metaSPALoad.call(undefined, config);
};
exports.bootstrap = bootstrap;
//# sourceMappingURL=index.js.map

/***/ })

}]);
//# sourceMappingURL=vendor.js.map