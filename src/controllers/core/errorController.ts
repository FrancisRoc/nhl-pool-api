import { IApiError, IApiErrorAndInfo, isApiError, isApiErrorAndInfo, isErrorBuilder, IErrorResponse, createNotFoundError } from "../../models/core/apiError";
import { constants } from "../../../config/constants";
import { configs } from "../../../config/configs";
import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import * as express from "express";
import * as HttpStatusCodes from "http-status-codes";
let autobind = require("autobind-decorator");

let logger = createLogger("errorController");

/**
 * Error controller
 */
@autobind
class ErrorController {

    /**
     * Manages thrown errors
     */
    public genericErrorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

        //==========================================
        // Default values
        //==========================================
        let logLevel: LogLevel = LogLevel.ERROR;
        let logStackTrace: boolean = true;
        let httpStatus: number = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        let apiError: IApiError = {
            code: constants.errors.codes.GENERIC_ERROR,
            message: "An error occured"
        };

        //==========================================
        // If the error we received implements IApiErrorAndInfo,
        // we have extra informations on how to manage
        // it.
        //==========================================
        if (isApiErrorAndInfo(err)) {
            let apiErrorCustom: IApiErrorAndInfo = <IApiErrorAndInfo>err;

            if (apiErrorCustom.error) {
                apiError = apiErrorCustom.error;
            }
            if (apiErrorCustom.logLevel !== undefined) {
                logLevel = apiErrorCustom.logLevel;
            }
            if (apiErrorCustom.logStackTrace !== undefined) {
                logStackTrace = apiErrorCustom.logStackTrace;
            }
            if (apiErrorCustom.httpStatus) {
                httpStatus = apiErrorCustom.httpStatus;
            }
        }

        //==========================================
        // We may also simply have received an IApiError,
        // directly.
        //==========================================
        else if (isApiError(err)) {
            apiError = err;
        } else if (isErrorBuilder(err)) {
            logger.error("An ErrorBuilder has been received as an error! You probably forgot to call '.build()' when creating the error.");
        }

        //==========================================
        // Logs the error
        //==========================================
        let msg: string = "[" + httpStatus + "] - " + (logStackTrace ? (err.stack || err.message || err) : (err.message || err));
        logger.log(logLevel, msg);

        //==========================================
        // Headers already sent, we souldn't send anything
        // more.
        //==========================================
        if (res.headersSent) {
            return next(err);
        }

        //==========================================
        // On a dev environment, we can add the stack
        // trace to the public message.
        //==========================================
        if (configs.environment.isDev && configs.logging.addStackTraceToErrorMessagesInDev) {
            apiError.message = (apiError.message || "") + "\n" + (err.stack || "[no stack trace available]");
        }

        //==========================================
        // Creates the IErrorResponse object to
        // return.
        //==========================================
        let errorResponse: IErrorResponse = {
            error: apiError
        };

        res.setHeader("content-type", "application/json");
        res.status(httpStatus);
        res.send(JSON.stringify(errorResponse));
    }

    /**
     * Manages "Resource Not Found" errors. This is going to be called by
     * the web framework when no other route matches.
     */
    public notFoundErrorHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.genericErrorHandler(createNotFoundError(`Resource not found : ${req.url}`, "Resource not found", LogLevel.DEBUG, false),
            req,
            res,
            next);
    }
}
export let errorController: ErrorController = new ErrorController();
