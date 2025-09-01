"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var log4js = require("log4js");
var tsyringe_1 = require("tsyringe");
/**
 * Logger utility class that provides consistent logging across the framework
 * Uses log4js under the hood with configurable log levels
 */
var Logger = function () {
    var _classDecorators = [(0, tsyringe_1.injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var Logger = _classThis = /** @class */ (function () {
        /**
         * Creates a new logger instance for the specified context
         * @param context The class or component name that is using the logger
         */
        function Logger_1(context) {
            this.context = context;
            this.configureLogger();
            this.logger = log4js.getLogger(context);
            this.logger.level = process.env.LOG_LEVEL || 'info';
        }
        /**
         * Configure the logger with appropriate appenders and layouts
         */
        Logger_1.prototype.configureLogger = function () {
            log4js.configure({
                appenders: {
                    console: { type: 'console', layout: { type: 'colored' } },
                    file: {
                        type: 'file',
                        filename: 'logs/test.log',
                        maxLogSize: 10485760,
                        backups: 3,
                        compress: true
                    }
                },
                categories: {
                    default: {
                        appenders: ['console', 'file'],
                        level: process.env.LOG_LEVEL || 'info'
                    }
                }
            });
        };
        /**
         * Log a message at debug level
         * @param message The message to log
         * @param args Optional arguments to include
         */
        Logger_1.prototype.debug = function (message) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (_a = this.logger).debug.apply(_a, __spreadArray(["[".concat(this.context, "] ").concat(message)], args, false));
        };
        /**
         * Log a message at info level
         * @param message The message to log
         * @param args Optional arguments to include
         */
        Logger_1.prototype.info = function (message) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (_a = this.logger).info.apply(_a, __spreadArray(["[".concat(this.context, "] ").concat(message)], args, false));
        };
        /**
         * Log a message at warn level
         * @param message The message to log
         * @param args Optional arguments to include
         */
        Logger_1.prototype.warn = function (message) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (_a = this.logger).warn.apply(_a, __spreadArray(["[".concat(this.context, "] ").concat(message)], args, false));
        };
        /**
         * Log a message at error level
         * @param message The message to log
         * @param args Optional arguments to include
         */
        Logger_1.prototype.error = function (message) {
            var _a, _b;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (message instanceof Error) {
                (_a = this.logger).error.apply(_a, __spreadArray(["[".concat(this.context, "] ").concat(message.message), message.stack], args, false));
            }
            else {
                (_b = this.logger).error.apply(_b, __spreadArray(["[".concat(this.context, "] ").concat(message)], args, false));
            }
        };
        /**
         * Log a message at fatal level
         * @param message The message to log
         * @param args Optional arguments to include
         */
        Logger_1.prototype.fatal = function (message) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (_a = this.logger).fatal.apply(_a, __spreadArray(["[".concat(this.context, "] ").concat(message)], args, false));
        };
        return Logger_1;
    }());
    __setFunctionName(_classThis, "Logger");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Logger = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Logger = _classThis;
}();
exports.Logger = Logger;
