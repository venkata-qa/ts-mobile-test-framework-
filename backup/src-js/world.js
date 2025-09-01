"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestWorld = void 0;
var cucumber_1 = require("@cucumber/cucumber");
var tsyringe_1 = require("tsyringe");
var logger_1 = require("../../core/utils/logger");
var config_manager_1 = require("../../core/utils/config-manager");
var driverFactory_1 = require("../../core/driver/driverFactory");
var apiClient_1 = require("../../api/apiClient");
/**
 * Custom world configuration for Cucumber
 * Extends the base World class to provide framework-specific context
 */
var TestWorld = /** @class */ (function (_super) {
    __extends(TestWorld, _super);
    function TestWorld(options) {
        var _this = _super.call(this, options) || this;
        _this.testData = {};
        _this.tags = [];
        _this.logger = new logger_1.Logger('TestWorld');
        _this.configManager = new config_manager_1.ConfigManager();
        _this.driverFactory = new driverFactory_1.DriverFactory();
        return _this;
    }
    /**
     * Initialize the mobile driver
     * @param platform Optional platform override (android or ios)
     * @param capabilities Optional capabilities override
     */
    TestWorld.prototype.initMobileDriver = function (platform, capabilities) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.logger.info("Initializing mobile driver for ".concat(platform || 'default platform'));
                        _a = this;
                        return [4 /*yield*/, this.driverFactory.createDriver(platform, capabilities)];
                    case 1:
                        _a.driver = _b.sent();
                        this.logger.info('Mobile driver initialized successfully');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        this.logger.error('Failed to initialize mobile driver', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initialize the API client
     * @param baseUrl Optional base URL to set
     */
    TestWorld.prototype.initApiClient = function (baseUrl) {
        this.logger.info('Initializing API client');
        this.apiClient = new apiClient_1.ApiClient();
        // If a baseUrl is provided or stored in test data, set it
        var url = baseUrl || this.getTestData('baseUrl');
        if (url) {
            this.apiClient.setBaseUrl(url);
            this.logger.info("Set API base URL to: ".concat(url));
        }
        this.logger.info('API client initialized successfully');
    };
    /**
     * Store data to be shared across steps
     * @param key The key to store the data under
     * @param value The value to store
     */
    TestWorld.prototype.setTestData = function (key, value) {
        this.testData[key] = value;
        this.logger.debug("Set test data: ".concat(key), value);
    };
    /**
     * Retrieve stored test data
     * @param key The key to retrieve
     * @returns The stored value, or undefined if not found
     */
    TestWorld.prototype.getTestData = function (key) {
        return this.testData[key];
    };
    /**
     * Take a screenshot and attach to the current scenario
     * @param name Screenshot name
     */
    TestWorld.prototype.takeScreenshot = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var screenshotBase64, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.driver) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.driver.takeScreenshot()];
                    case 2:
                        screenshotBase64 = _a.sent();
                        this.attach(Buffer.from(screenshotBase64, 'base64'), 'image/png');
                        this.logger.debug("Screenshot taken: ".concat(name));
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        this.logger.error('Failed to take screenshot', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clean up resources after scenario
     */
    TestWorld.prototype.cleanup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.driver) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        this.logger.info('Cleaning up driver');
                        return [4 /*yield*/, this.driver.deleteSession()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_3 = _a.sent();
                        this.logger.error('Error during cleanup', error_3);
                        return [3 /*break*/, 5];
                    case 4:
                        this.driver = undefined;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return TestWorld;
}(cucumber_1.World));
exports.TestWorld = TestWorld;
// Register the custom world with Cucumber
(0, cucumber_1.setWorldConstructor)(TestWorld);
// Register types for dependency injection
tsyringe_1.container.register('ConfigManager', { useClass: config_manager_1.ConfigManager });
tsyringe_1.container.register('Logger', { useClass: logger_1.Logger });
tsyringe_1.container.register('DriverFactory', { useClass: driverFactory_1.DriverFactory });
tsyringe_1.container.register('ApiClient', { useClass: apiClient_1.ApiClient });
