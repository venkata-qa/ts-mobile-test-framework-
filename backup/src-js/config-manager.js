"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
var dotenv = require("dotenv");
var fs = require("fs");
var path = require("path");
var tsyringe_1 = require("tsyringe");
var logger_1 = require("../utils/logger");
/**
 * Configuration manager class
 * Handles loading and accessing configuration from various sources (env vars, config files)
 */
var ConfigManager = function () {
    var _classDecorators = [(0, tsyringe_1.injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ConfigManager = _classThis = /** @class */ (function () {
        /**
         * Initialize the configuration manager
         */
        function ConfigManager_1() {
            this.config = {};
            this.logger = new logger_1.Logger('ConfigManager');
            this.loadConfig();
        }
        /**
         * Load configuration from multiple sources with proper precedence
         * 1. Environment variables
         * 2. .env file
         * 3. JSON config files
         * 4. Default values
         */
        ConfigManager_1.prototype.loadConfig = function () {
            // Load .env file
            dotenv.config();
            // Set the environment
            var env = process.env.TEST_ENV || 'dev';
            // Load the base config
            var baseConfigPath = path.resolve(process.cwd(), 'config/default.json');
            var baseConfig = {};
            if (fs.existsSync(baseConfigPath)) {
                try {
                    baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, 'utf8'));
                }
                catch (error) {
                    this.logger.error("Failed to parse base config file: ".concat(error));
                }
            }
            // Load the environment-specific config
            var envConfigPath = path.resolve(process.cwd(), "config/".concat(env, ".json"));
            var envConfig = {};
            if (fs.existsSync(envConfigPath)) {
                try {
                    envConfig = JSON.parse(fs.readFileSync(envConfigPath, 'utf8'));
                }
                catch (error) {
                    this.logger.error("Failed to parse env config file: ".concat(error));
                }
            }
            // Merge configurations with proper precedence
            this.config = __assign(__assign(__assign({ 
                // Default values
                platform: 'android', environment: env, appiumUrl: 'http://localhost:4723', baseApiUrl: 'https://api.example.com', cloudEnabled: false, cloudProvider: 'browserstack', implicitTimeout: 5000, explicitTimeout: 15000, retryAttempts: 3 }, baseConfig), envConfig), this.getEnvVarConfig());
            this.logger.info("Configuration loaded for environment: ".concat(env));
            this.logger.debug('Configuration:', this.config);
        };
        /**
         * Get configuration values from environment variables
         */
        ConfigManager_1.prototype.getEnvVarConfig = function () {
            return {
                platform: process.env.PLATFORM,
                appiumUrl: process.env.APPIUM_URL,
                baseApiUrl: process.env.BASE_API_URL,
                cloudEnabled: process.env.CLOUD_ENABLED === 'true',
                cloudProvider: process.env.CLOUD_PROVIDER,
                cloudUser: process.env.CLOUD_USER,
                cloudKey: process.env.CLOUD_KEY,
                implicitTimeout: process.env.IMPLICIT_TIMEOUT ? parseInt(process.env.IMPLICIT_TIMEOUT, 10) : undefined,
                explicitTimeout: process.env.EXPLICIT_TIMEOUT ? parseInt(process.env.EXPLICIT_TIMEOUT, 10) : undefined,
                retryAttempts: process.env.RETRY_ATTEMPTS ? parseInt(process.env.RETRY_ATTEMPTS, 10) : undefined
            };
        };
        /**
         * Get the full config object
         */
        ConfigManager_1.prototype.getConfig = function () {
            return __assign({}, this.config);
        };
        /**
         * Get a specific config value
         * @param key The configuration key
         * @param defaultValue Default value if the key is not found
         */
        ConfigManager_1.prototype.get = function (key, defaultValue) {
            return (this.config[key] !== undefined) ? this.config[key] : defaultValue;
        };
        return ConfigManager_1;
    }());
    __setFunctionName(_classThis, "ConfigManager");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfigManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfigManager = _classThis;
}();
exports.ConfigManager = ConfigManager;
