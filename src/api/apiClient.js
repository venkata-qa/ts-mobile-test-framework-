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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = exports.HttpMethod = void 0;
var axios_1 = require("axios");
var tsyringe_1 = require("tsyringe");
var logger_1 = require("../core/utils/logger");
var config_manager_1 = require("../core/utils/config-manager");
/**
 * HTTP methods supported by the API client
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["OPTIONS"] = "OPTIONS";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
/**
 * API client for making HTTP requests
 * Provides a wrapper around Axios with additional functionality
 */
var ApiClient = function () {
    var _classDecorators = [(0, tsyringe_1.injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ApiClient = _classThis = /** @class */ (function () {
        function ApiClient_1() {
            this.requestTimings = new Map();
            this.logger = new logger_1.Logger('ApiClient');
            this.configManager = new config_manager_1.ConfigManager();
            this.client = this.createClient();
        }
        /**
         * Create and configure the axios client
         * @returns Configured axios instance
         */
        ApiClient_1.prototype.createClient = function () {
            var baseUrl = this.configManager.get('baseApiUrl', '');
            var client = axios_1.default.create({
                baseURL: baseUrl,
                timeout: this.configManager.get('apiTimeout', 30000),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                validateStatus: function (status) {
                    // Accept all status codes to handle them in the response interceptor
                    return true;
                }
            });
            this.setupInterceptors(client);
            return client;
        };
        /**
         * Set up request and response interceptors
         */
        ApiClient_1.prototype.setupInterceptors = function (client) {
            var _this = this;
            // Request interceptor
            client.interceptors.request.use(function (config) {
                var _a;
                // Create a unique request ID
                var requestId = "".concat(Date.now(), "-").concat(Math.random().toString(36).substring(2, 9));
                // Store request start time
                _this.requestTimings.set(requestId, Date.now());
                // Add request ID as a custom header for tracking
                config.headers = config.headers || {};
                config.headers['X-Request-ID'] = requestId;
                // Log request details
                _this.logger.info("API Request: ".concat(((_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'UNKNOWN', " ").concat(config.url), {
                    headers: _this.sanitizeHeaders(config.headers || {}),
                    params: config.params,
                    data: config.data
                });
                return config;
            }, function (error) {
                _this.logger.error('API Request Error:', error);
                return Promise.reject(error);
            });
            // Response interceptor
            client.interceptors.response.use(function (response) {
                var _a;
                var requestId = (_a = response.config.headers) === null || _a === void 0 ? void 0 : _a['X-Request-ID'];
                var startTime = _this.requestTimings.get(requestId) || Date.now();
                var duration = Date.now() - startTime;
                _this.logger.debug("API Response: ".concat(response.status, " ").concat(response.config.url, " (").concat(duration, "ms)"), response.data);
                _this.requestTimings.delete(requestId);
                return response;
            }, function (error) {
                var _a;
                if (error.response && error.config) {
                    var requestId = (_a = error.config.headers) === null || _a === void 0 ? void 0 : _a['X-Request-ID'];
                    var startTime = _this.requestTimings.get(requestId) || Date.now();
                    var duration = Date.now() - startTime;
                    _this.logger.error("API Error: ".concat(error.response.status, " ").concat(error.config.url, " (").concat(duration, "ms)"), error.response.data);
                    _this.requestTimings.delete(requestId);
                }
                else {
                    _this.logger.error('API Error without response', error.message);
                }
                return Promise.reject(error);
            });
        };
        /**
         * Set the base URL for API requests
         * @param url The base URL
         */
        ApiClient_1.prototype.setBaseUrl = function (url) {
            this.client.defaults.baseURL = url;
            this.logger.info("Set base URL to: ".concat(url));
        };
        /**
         * Set a global header for all requests
         * @param name Header name
         * @param value Header value
         */
        ApiClient_1.prototype.setHeader = function (name, value) {
            this.client.defaults.headers.common[name] = value;
        };
        /**
         * Set authorization header
         * @param token The authorization token
         * @param scheme The auth scheme (e.g., 'Bearer')
         */
        ApiClient_1.prototype.setAuthToken = function (token, scheme) {
            if (scheme === void 0) { scheme = 'Bearer'; }
            this.client.defaults.headers.common['Authorization'] = "".concat(scheme, " ").concat(token);
        };
        /**
         * Perform a GET request
         * @param url API endpoint URL
         * @param params URL query parameters
         * @param config Additional axios config
         * @returns API response
         */
        ApiClient_1.prototype.get = function (url, params, config) {
            return __awaiter(this, void 0, void 0, function () {
                var baseUrl, fullUrl_1, startTime, headers_1, response, duration, data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            baseUrl = this.client.defaults.baseURL || '';
                            fullUrl_1 = new URL(url, baseUrl);
                            // Add query params if provided
                            if (params) {
                                Object.entries(params).forEach(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    fullUrl_1.searchParams.append(key, String(value));
                                });
                            }
                            startTime = Date.now();
                            headers_1 = new Headers({
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            });
                            // Add any common headers from axios client
                            if (this.client.defaults.headers.common) {
                                Object.entries(this.client.defaults.headers.common).forEach(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    if (value !== undefined && typeof value === 'string') {
                                        headers_1.append(key, value);
                                    }
                                });
                            }
                            return [4 /*yield*/, fetch(fullUrl_1.toString(), {
                                    method: 'GET',
                                    headers: headers_1
                                })];
                        case 1:
                            response = _a.sent();
                            duration = Date.now() - startTime;
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _a.sent();
                            // Log the response
                            this.logger.debug("API Response: ".concat(response.status, " ").concat(fullUrl_1, " (").concat(duration, "ms)"), data);
                            // Create an ApiResponse object
                            return [2 /*return*/, {
                                    status: response.status,
                                    data: data,
                                    headers: Object.fromEntries(response.headers.entries()),
                                    requestTime: duration,
                                    requestUrl: url,
                                    requestMethod: HttpMethod.GET
                                }];
                        case 3:
                            error_1 = _a.sent();
                            throw this.handleError(error_1);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Perform a POST request
         * @param url API endpoint URL
         * @param data Request body data
         * @param config Additional axios config
         * @returns API response
         */
        ApiClient_1.prototype.post = function (url, data, config) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.post(url, data, config)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.formatResponse(response, HttpMethod.POST, url)];
                        case 2:
                            error_2 = _a.sent();
                            throw this.handleError(error_2);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Perform a PUT request
         * @param url API endpoint URL
         * @param data Request body data
         * @param config Additional axios config
         * @returns API response
         */
        ApiClient_1.prototype.put = function (url, data, config) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.put(url, data, config)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.formatResponse(response, HttpMethod.PUT, url)];
                        case 2:
                            error_3 = _a.sent();
                            throw this.handleError(error_3);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Perform a PATCH request
         * @param url API endpoint URL
         * @param data Request body data
         * @param config Additional axios config
         * @returns API response
         */
        ApiClient_1.prototype.patch = function (url, data, config) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.patch(url, data, config)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.formatResponse(response, HttpMethod.PATCH, url)];
                        case 2:
                            error_4 = _a.sent();
                            throw this.handleError(error_4);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Perform a DELETE request
         * @param url API endpoint URL
         * @param config Additional axios config
         * @returns API response
         */
        ApiClient_1.prototype.delete = function (url, config) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.delete(url, config)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.formatResponse(response, HttpMethod.DELETE, url)];
                        case 2:
                            error_5 = _a.sent();
                            throw this.handleError(error_5);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Format the axios response to our ApiResponse interface
         * @param axiosResponse The response from axios
         * @param method The HTTP method used
         * @param url The requested URL
         * @returns Formatted API response
         */
        /**
         * Sanitize headers to remove sensitive information before logging
         * @param headers Headers object to sanitize
         * @returns Sanitized headers
         */
        ApiClient_1.prototype.sanitizeHeaders = function (headers) {
            var sensitiveHeaders = ['authorization', 'x-api-key', 'cookie', 'set-cookie'];
            var sanitized = __assign({}, headers);
            for (var _i = 0, _a = Object.keys(sanitized); _i < _a.length; _i++) {
                var key = _a[_i];
                if (sensitiveHeaders.includes(key.toLowerCase())) {
                    sanitized[key] = '******';
                }
            }
            return sanitized;
        };
        /**
         * Format the axios response to our ApiResponse interface
         * @param axiosResponse The response from axios
         * @param method The HTTP method used
         * @param url The requested URL
         * @returns Formatted API response
         */
        ApiClient_1.prototype.formatResponse = function (axiosResponse, method, url) {
            var _a;
            var requestId = (_a = axiosResponse.config.headers) === null || _a === void 0 ? void 0 : _a['X-Request-ID'];
            var startTime = this.requestTimings.get(requestId) || 0;
            var requestTime = startTime ? Date.now() - startTime : 0;
            return {
                status: axiosResponse.status,
                data: axiosResponse.data,
                headers: axiosResponse.headers,
                requestTime: requestTime,
                requestUrl: url,
                requestMethod: method
            };
        };
        /**
         * Handle and format API errors
         * @param error The error thrown by axios
         * @returns Formatted error with additional context
         */
        ApiClient_1.prototype.handleError = function (error) {
            var _a, _b, _c, _d, _e;
            if (axios_1.default.isAxiosError(error)) {
                var status_1 = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 0;
                var url = ((_b = error.config) === null || _b === void 0 ? void 0 : _b.url) || '';
                var method = ((_d = (_c = error.config) === null || _c === void 0 ? void 0 : _c.method) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || '';
                var data = ((_e = error.response) === null || _e === void 0 ? void 0 : _e.data) || '';
                var errorMessage = "API Error (".concat(status_1, ") for ").concat(method, " ").concat(url, ": ").concat(error.message);
                var enhancedError = new Error(errorMessage);
                // Add additional properties to the error
                enhancedError.status = status_1;
                enhancedError.data = data;
                enhancedError.url = url;
                enhancedError.method = method;
                return enhancedError;
            }
            return error;
        };
        return ApiClient_1;
    }());
    __setFunctionName(_classThis, "ApiClient");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApiClient = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApiClient = _classThis;
}();
exports.ApiClient = ApiClient;
