//==========================================
// Interfaces and classes related to errors
// to be sent in response to an API request.
//
// It is recommended that you use the provided
// builder to create an error. This builder can be
// started by using the exported "createError()"
// function.
//
// The structure of those errors is based on
// https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7102-error-condition-responses
//
//==========================================

import { LogLevel } from "../../utils/logLevel";
import { constants } from "../../../config/constants";
import * as HttpStatusCodes from "http-status-codes";

export { LogLevel };

/**
 * Represents the final object containing an error to return
 * as a response to a request.
 */
export interface IErrorResponse {

    /**
     * The error object.
     */
    error: IApiError;
}

/**
 * An error object.
 */
export interface IApiError {

    /**
     * One of a server-defined set of error codes.
     */
    code: string;

    /**
     * A human-readable representation of the error.
     */
    message: string;

    /**
     * The target of the error.
     */
    target?: string;

    /**
     * An array of details about specific errors that led to this reported error.
     */
    details?: IApiError[];

    /**
     * An object containing more specific information than the current object
     * about the error.
     */
    innererror?: IApiInnerError;
}

/**
 * Error Type Guard
 */
export let isApiError = (obj: any): obj is IApiError => {
    return obj &&
        ("code" in obj) &&
        ("message" in obj);
};

/**
 * An object containing more specific information than the current
 * object about the error.
 */
export interface IApiInnerError {

    /**
     * A more specific error code than was provided by the containing error.
     */
    code?: string;

    /**
     * An object containing more specific information than the current object
     * about the error.
     */
    innererror?: IApiInnerError;

    /**
     * Any number of custom properties.
     */
    [name: string]: any;
}

/**
 * Represents an error and some extra informations
 * to use to manage it.
 */
export interface IApiErrorAndInfo {

    /**
     * The error to send.
     */
    error: IApiError;

    /**
     * The http status to use to send the error.
     */
    httpStatus: number;

    /**
     * The log message
     */
    logMessage: string;

    /**
     * The log level
     */
    logLevel?: LogLevel;

    /**
     * Log stackTrace?
     */
    logStackTrace?: boolean;
}

/**
 * IApiErrorAndInfo Type Guard
 */
export let isApiErrorAndInfo = (obj: any): obj is IApiErrorAndInfo => {
    return obj &&
        ("error" in obj) &&
        isApiError(obj.error) &&
        ("httpStatus" in obj) &&
        ("logMessage" in obj);
};

/**
 * Concrete error class to throw. It contains the actual error
 * to return and some extra info to help manage it.
 *
 * Since it extends the standard Node "Error" class, the stack trace will
 * be available.
 */
export class ApiErrorAndInfo extends Error implements IApiErrorAndInfo {
    constructor(public error: IApiError,
        public logMessage: string,
        public httpStatus: number,
        public logLevel: LogLevel,
        public logStackTrace: boolean) {
        super(logMessage);
    }
}

/**
 * Builder to create errors.
 */
export class ErrorBuilder {

    private _code: string;
    private _logMessage: string;
    private _publicMessage: string;
    private _target: string;
    private _details: IApiError[];
    private _innererror: IApiInnerError;
    private _httpStatus: number;
    private _logLevel: LogLevel;
    private _logStackTrace: boolean;

    /**
     * Constructor
     * The error node and log message are mandatory.
     */
    constructor(code: string, logMessage: string) {
        this._code = code;
        this._logMessage = logMessage;
    }

    public publicMessage = (publicMessage: string): ErrorBuilder => {
        this._publicMessage = publicMessage;
        return this;
    }

    public target = (target: string): ErrorBuilder => {
        this._target = target;
        return this;
    }

    public details = (details: IApiError[]): ErrorBuilder => {
        this._details = details;
        return this;
    }

    public addDetail = (detail: IApiError): ErrorBuilder => {

        if (!this._details) {
            this._details = [];
        }
        this._details.push(detail);
        return this;
    }

    public innererror = (innererror: IApiInnerError): ErrorBuilder => {
        this._innererror = innererror;
        return this;
    }

    public httpStatus = (httpStatus: number): ErrorBuilder => {
        this._httpStatus = httpStatus;
        return this;
    }

    public logLevel = (logLevel: LogLevel): ErrorBuilder => {
        this._logLevel = logLevel;
        return this;
    }

    public logStackTrace = (logStackTrace: boolean): ErrorBuilder => {
        this._logStackTrace = logStackTrace;
        return this;
    }

    /**
     * Builds the error!
     */
    public build = (): ApiErrorAndInfo => {

        let error: IApiError = {
            code: this._code,
            message: this._publicMessage || "An error occured"
        };

        if (this._target != undefined) {
            error.target = this._target;
        }

        if (this._details && this._details.length > 0) {
            error.details = this._details;
        }

        if (this._innererror != undefined) {
            error.innererror = this._innererror;
        }

        let errorAndInfo: ApiErrorAndInfo = new ApiErrorAndInfo(
            error,
            this._logMessage,
            this._httpStatus || HttpStatusCodes.INTERNAL_SERVER_ERROR,
            (this._logLevel !== undefined ? this._logLevel : LogLevel.ERROR),
            (this._logStackTrace !== undefined ? this._logStackTrace : true));

        return errorAndInfo;
    }
}

/**
 * ErrorBuilder Type Guard
 */
export let isErrorBuilder = (obj: any): obj is ErrorBuilder => {
    return obj && obj.addDetail != undefined && obj.build != undefined;
};

/**
 * Starts a builder to create an error.
 *
 * The error node and log message are mandatory.
 */
export function createError(code: string, logMessage: string): ErrorBuilder {
    let builder: ErrorBuilder = new ErrorBuilder(code, logMessage);
    return builder;
}

/**
 * Easily creates a Not Found error (404)
 *
 * @param logMessage The message to log.
 * @param publicMessage The message to return in the error.
 * @param logLevel The log level to use.
 * @param logStackTrace Should the stack trace be logged?
 */
export function createNotFoundError(
    logMessage: string,
    publicMessage: string = "Not Found",
    logLevel: LogLevel = LogLevel.DEBUG,
    logStackTrace: boolean = false): ApiErrorAndInfo {

    return createError(constants.errors.codes.NOT_FOUND, logMessage)
        .httpStatus(HttpStatusCodes.NOT_FOUND)
        .publicMessage(publicMessage)
        .logLevel(logLevel)
        .logStackTrace(logStackTrace)
        .build();
}

/**
 * Easily creates an invalid parameter error (400)
 *
 * @param publicMessage The message to return in the error (will also be logged).
 * @param details Some additional information about the validation that failed.
 * @param logLevel The log level to use.
 * @param logStackTrace Should the stack trace be logged?
 */
export function createInvalidParameterError(
    publicMessage: string,
    details: IApiError[] = [],
    logLevel: LogLevel = LogLevel.DEBUG,
    logStackTrace: boolean = false): ApiErrorAndInfo {

    return createError(constants.errors.codes.INVALID_PARAMETER, publicMessage)
        .httpStatus(HttpStatusCodes.BAD_REQUEST)
        .publicMessage(publicMessage)
        .details(details)
        .logLevel(logLevel)
        .logStackTrace(logStackTrace)
        .build();
}

/**
 * Easily creates an internal server error (500)
 *
 * @param publicMessage The message to return in the error (will also be logged).
 * @param details Some additional information about the validation that failed.
 * @param logLevel The log level to use.
 * @param logStackTrace Should the stack trace be logged?
 */
export function createInternalServerError(
    publicMessage: string,
    innerError: Error,
    details: IApiError[] = [],
    logLevel: LogLevel = LogLevel.DEBUG,
    logStackTrace: boolean = false): ApiErrorAndInfo {

    return createError(constants.errors.codes.GENERIC_ERROR, publicMessage)
        .httpStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .publicMessage(publicMessage)
        .details(details)
        .logLevel(logLevel)
        .logStackTrace(logStackTrace)
        .build();
}
