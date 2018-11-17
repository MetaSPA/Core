"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var scriptjs_1 = tslib_1.__importDefault(require("scriptjs"));
var MetaSPA = tslib_1.__importStar(require("./index"));
var MetaSPACore = /** @class */ (function () {
    function MetaSPACore() {
        var _this = this;
        this.runTime = {}; // used for storing general global data
        this.providers = {};
        this.registeredModules = {};
        this.metaSPALoad = function (config) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var namespace, modules, registration;
            return tslib_1.__generator(this, function (_a) {
                namespace = config.namespace, modules = config.modules;
                this.registeredModules[namespace] = modules;
                registration = this.registrations[namespace];
                registration.onLoad(this.registeredModules[namespace], this);
                return [2 /*return*/];
            });
        }); };
        this.registrations = {};
    }
    MetaSPACore.prototype.register = function (config) {
        var namespace = config.namespace;
        config.providers.push({ symbol: "MetaSPA", module: function () { return MetaSPA; } });
        this.registrations[namespace] = config;
        return this;
    };
    MetaSPACore.prototype._loadModuleAsync = function (namespace) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var module, promises, entries;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        module = this.registrations[namespace];
                        if (!module) return [3 /*break*/, 3];
                        if (!this.registeredModules[namespace]) return [3 /*break*/, 1];
                        module.onLoad(this.registeredModules[namespace], this);
                        return [2 /*return*/];
                    case 1:
                        promises = module.providers.map(function (p) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return tslib_1.__generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = this.providers;
                                        _b = p.symbol;
                                        return [4 /*yield*/, p.module()];
                                    case 1:
                                        _a[_b] = _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        _a.sent();
                        entries = Array.isArray(module.entries)
                            ? module.entries
                            : [module.entries];
                        entries.forEach(function (s) { return scriptjs_1.default(s, function () { }); });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MetaSPACore.prototype.loadModule = function (namespace) {
        this._loadModuleAsync(namespace);
        return this;
    };
    MetaSPACore.prototype._unMountModuleAsync = function (namespace) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var module;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        module = this.registrations[namespace];
                        if (!module) return [3 /*break*/, 2];
                        return [4 /*yield*/, module.unMount(this.registeredModules[namespace], this)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    MetaSPACore.prototype.unMountModule = function (namespace) {
        this._unMountModuleAsync(namespace);
        return this;
    };
    MetaSPACore.getInstance = function () {
        if (!window.metaSPA) {
            window.metaSPA = new MetaSPACore();
            window.metaSPALoad = window.metaSPA.metaSPALoad;
            window.metaSPAProvider = window.metaSPA.providers;
        }
        return window.metaSPA;
    };
    return MetaSPACore;
}());
var metaSPA = MetaSPACore.getInstance();
exports.metaSPA = metaSPA;
exports.default = MetaSPACore;
//# sourceMappingURL=index.js.map