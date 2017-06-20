import { Request, Response, NextFunction } from "express";
import { EndpointTypes } from "../../../config/constants";

/**
 * The http methods
 */
export enum HttpMethods {
    ALL, // All methods
    GET,
    POST,
    PUT,
    HEAD,
    DELETE,
    OPTIONS,
    TRACE,
    COPY,
    LOCK,
    MKCOL,
    MOVE,
    PURGE,
    PROPFIND,
    PROPPATCH,
    UNLOCK,
    REPORT,
    MKACTIVITY,
    CHECKOUT,
    MERGE,
    NOTIFY,
    SUBSCRIBE,
    UNSUBSCRIBE,
    PATCH,
    SEARCH,
    CONNECT
}

/**
 * http methods enum methods
 */
export namespace HttpMethods {

    /**
     * Conversts log level string representation to its associated
     * http methods enum value.
     */
    export function fromString(methodStr: string): HttpMethods {

        if (methodStr) {
            methodStr = methodStr.toUpperCase();
            return HttpMethods[methodStr];
        }
        return undefined;
    }

    /**
     * Converts a http method to its string representation.
     */
    export function toString(method: HttpMethods): string {

        if (isNaN(method)) {
            return undefined;
        }
        return HttpMethods[method];
    }

    /**
     * Converts a http method to its associated Express method name
     */
    export function toExpressMethodName(method: HttpMethods): string {
        let name = toString(method);
        return name ? name.toLowerCase() : name;
    }

}

/**
 * The base informations of a route.
 */
export interface IRoute {

    /**
     * The HTTP method
     */
    method: HttpMethods;

    /**
     * The *relative* path of the route
     * Example : "/users/search"
     *
     * This path will be automatically prefixed with the
     * root for the endpoint type and by
     * the common domain path.
     */
    path: string;

    /**
     * The type of endpoint. This will affect the
     * root of the generated full path to the endpoint.
     *
     * Defaults to "API".
     */
    endpointType?: EndpointTypes;
}

/**
 * The informations required to build a route, including
 * the handler and the potential middlewares specific to the
 * route.
 */
export interface IHandlerRoute extends IRoute {

    /**
     * The handler function to manage requests to this route.
     */
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>;

    /**
     * Optional. Middlewares to use with this route.
     */
    middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[];
}
