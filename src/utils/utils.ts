//==========================================
// General utilities
//==========================================

import * as fs from "fs";
import * as pathUtils from "path";
import * as marked from "marked";
import * as express from "express";
import { configs } from "../../config/configs";
import { EndpointTypes } from "../../config/constants";
import * as _ from "lodash";
import * as rimraf from "rimraf";
let globby = require("globby");
let execFile = require("child_process").execFile;
import { createLogger } from "./logger";

let logger = createLogger("utils");

/**
 * General utilities
 */
export interface IUtils {

    /**
     * Converts a string to a boolean.
     *
     * The string is TRUE only if it is
     * "true" (case insensitive) or "1"
     * (the *number* 1 is also accepted)
     *
     * Otherwise, it is considered as FALSE.
     */
    stringToBoolean(str: string): boolean;

    /**
     * Checks if a String is null, undefined,
     * empty, or contains only whitespaces.
     */
    isBlank(str: string): boolean;

    /**
     * Checks if a value is an integer.
     *
     * If you want to use the includeZero parameter without
     * using the positiveOnly parameter, we suggest to pass
     * undefined as a second parameter.
     *
     * After a positive check, we suggest to
     * pass the value with the Number object (Number(value))
     * to "clean" it, e.g., getting rid of unmeaningful
     * decimal zeros or whitespaces.
     */
    isIntegerValue(value: any, positiveOnly?: boolean, includeZero?: boolean): boolean;

    /**
     * A better version of "isNaN()".
     * For example, an empty string is NOT considered as a
     * number.
     */
    isNaNSafe(value: any): boolean;

    /**
     * Returns the "readme.md" file converted to
     * HTML.
     */
    getReadmeHtml(): string;

    /**
     * Runs the "tsc" command on specific files
     * using the same options than the ones found
     * in the "tsconfig.json" file of the project.
     *
     * Returns a Promise.
     *
     * @param files the absolute paths of the files to compile.
     */
    tsc(files: string[]): Promise<void>;

    /**
     * A promisified version of the async "exec" function.
     * Will output both stdout and stderr to the console.
     */
    execPromisified(command: string, args: string[]): Promise<void>;

    /**
     * Promisified setTimeout() utility function.
     *
     * @param ms The number of milliseconds to sleep for.
     */
    sleep(ms: number): Promise<void>;

    /**
     * Create a full public path, given the relative path and the
     * type of endpoint the URL is for.
     *
     * The path will start with a "/".
     */
    createPublicFullPath(relativePath: string, endpointType: EndpointTypes): string;

    /**
     * Create an absolute public URL, given the relative path and the
     * type of endpoint the URL is for.
     */
    createPublicUrl(relativePath: string, endpointType: EndpointTypes, port?: number): string;

    /**
     * Gets the root path to use for a given
     * endpoint type.
     *
     * The path will start with a "/".
     */
    getEndpointTypeRoot(endpointType: EndpointTypes): string;

    /**
     * Deletes a file, promisified and in a
     * solid way.
     *
     * You can't delete a root file using this function.
     */
    deleteFile(filePath: string): void;

    /**
     * Deletes a directory, promisified and in a
     * solid way.
     *
     * You can't delete a root directory using this function.
     */
    deleteDir(dirPath: string): void;

    /**
     * Clears a directory, promisified and in a
     * solid way.
     *
     * You can't clear a root directory using this function.
     */
    clearDir(dirPath: string): void;

    /**
     * If the "el" is not undefined, returns it as is.
     * If the el is undefined, returns NULL.
     *
     * This is useful when undefined is not acceptable
     * but null is.
     */
    getDefinedOrNull(el: any): any;

}

/**
 * General utilities default implementation
 */
export class Utils implements IUtils {

    private readmeHtml: string;
    private _tscCompilerOptions: string[];

    stringToBoolean(str: string): boolean {

        if (str === null || str === undefined) {
            return false;
        }

        if (typeof str === "number") {
            str = str + "";
        } else if (typeof str !== "string") {
            logger.warning(`stringToBoolean() called on an invalid object : ${str}`);
            return false;
        }

        str = str.toLowerCase();
        if (str === "true" || str === "1") {
            return true;
        }
        return false;
    }

    isBlank(str: string): boolean {

        if (str === null || str === undefined) {
            return true;
        }

        if (!(typeof str === "string")) {
            logger.warning(`isBlank() called on a non-string : ${str}`);
            return false;
        }

        return str.trim() === "";
    }

    isIntegerValue(value: any, positiveOnly: boolean = false, includeZero: boolean = true): boolean {

        if (this.isNaNSafe(value)) {
            return false;
        }

        // Convert to Number, if not already one
        let asNumber = Number(value);

        if (positiveOnly && asNumber < 0) {
            return false;
        }

        if (!includeZero && asNumber === 0) {
            return false;
        }

        // Busts integer safe limits
        if (asNumber > Number.MAX_SAFE_INTEGER || asNumber < Number.MIN_SAFE_INTEGER) {
            return false;
        }

        // If there were decimals but "0" only, it is
        // still considered as an Integer, and Number(value)
        // still have stripped those decimals....
        if ((asNumber + "").indexOf(".") > -1) {
            return false;
        }

        return true;
    }

    isNaNSafe(value: any): boolean {

        if (isNaN(value)) {
            return true;
        }

        let type = typeof value;
        if ((type !== "string" && type !== "number") || value === "") {
            return true;
        }

        return false;
    }

    getReadmeHtml(): string {

        if (!this.readmeHtml) {
            this.readmeHtml = marked(fs.readFileSync(__dirname + "/../../readme.md", "UTF-8"));

            //==========================================
            // We replace the hardcoded URLS to the actual urls.
            //==========================================
            for (let pos in EndpointTypes) {
                let endpointType = EndpointTypes[pos];
                if (endpointType !== EndpointTypes[EndpointTypes.NONE]) {
                    let actualUrl = _.trimEnd(this.createPublicUrl("/", EndpointTypes[endpointType]), "/");
                    let endpointTypeRoot = utils.getEndpointTypeRoot(EndpointTypes[endpointType]);
                    this.readmeHtml = this.readmeHtml.split("http://localhost:12345" + endpointTypeRoot + "/some/business/domain").join(`${actualUrl}`);
                }
            }
            let actualUrl = _.trimEnd(this.createPublicUrl("/", EndpointTypes.NONE), "/");
            this.readmeHtml = this.readmeHtml.split("http://localhost:12345").join(`${actualUrl}`);

            //==========================================
            // Section to remove
            //==========================================
            this.readmeHtml = this.readmeHtml.replace(/Les Endpoints par défaut du gabarit<\/h2>[\s\S]*?<p>Notez que le <em>path<\/em>/,
                "Les Endpoints par défaut du gabarit</h2>\n<p>Notez que le <em>path</em>");

            //==========================================
            // Nicer footer
            //==========================================
            this.readmeHtml = this.readmeHtml.replace(/<p>\|\n:-----:\|\n\|([\s\S]*?)<\/em><\/p>/,
                "<p style=\"text-align:center;\">$1<\/em><\/p>");
        }
        return this.readmeHtml;
    }

    protected get tscCompilerOptions(): string[] {

        if (!this._tscCompilerOptions) {

            this._tscCompilerOptions = [];
            let tsconfigObj = require(__dirname + "/../../tsconfig.json");
            for (let key in tsconfigObj.compilerOptions) {
                this._tscCompilerOptions.push("--" + key);
                this._tscCompilerOptions.push(tsconfigObj.compilerOptions[key]);
            }
        }
        return this._tscCompilerOptions;
    }

    tsc(files: string[]): Promise<void> {

        if (!files) {
            return Promise.resolve();
        }

        let cmd: string = "node";
        let args = [configs.root + "/node_modules/typescript/lib/tsc.js"]
            .concat(this.tscCompilerOptions)
            .concat(files);

        return this.execPromisified(cmd, args);
    }

    execPromisified(command: string, args: string[]): Promise<void> {

        return new Promise<void>(function (resolve, reject) {

            let theProcess = execFile(command, args, function (err: any, out: any, code: any) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
            theProcess.stdout.on("data", function (data: string) {
                if (data && data.endsWith("\n")) {
                    data = data.substring(0, data.length - 1);
                }
                console.log(data);
            });
            theProcess.stderr.on("data", function (data: string) {
                if (data && data.endsWith("\n")) {
                    data = data.substr(0, data.length - 1);
                }
                console.error(data);
            });
        });
    }

    async sleep(ms: number): Promise<void> {
        await new Promise(function (resolve, reject) {
            setTimeout(resolve, ms);
        });
    }

    createPublicFullPath(relativePath: string, endpointType: EndpointTypes): string {

        let fullPath = utils.getEndpointTypeRoot(endpointType);
        if (!this.isBlank(configs.api.domainPath) && endpointType !== EndpointTypes.NONE) {
            fullPath = _.trimEnd(fullPath, "/") + configs.api.domainPath;
        }

        relativePath = relativePath ? _.trim(relativePath, "/ ") : "";
        if (!this.isBlank(relativePath)) {
            fullPath = _.trimEnd(fullPath, "/") + "/" + relativePath;
        }

        return fullPath;
    }

    createPublicUrl(relativePath: string, endpointType: EndpointTypes, port: number = configs.api.port) {

        let scheme = configs.api.scheme || "http";
        scheme = _.trimEnd(scheme.toLowerCase(), ":");
        let url = scheme + "://" + configs.api.host;
        if (scheme === "http") {
            if (port !== 80) {
                url = url + ":" + port;
            }
        } else if (scheme === "https") {
            if (port !== 443) {
                url = url + ":" + port;
            }
        } else {
            throw new Error(`Unmanaged scheme : "${scheme}"`);
        }

        if (!this.isBlank(relativePath)) {
            url += this.createPublicFullPath(relativePath, endpointType);
        }

        return url;
    }

    getEndpointTypeRoot(endpointType: EndpointTypes) {

        // Defaults to "API"
        if (endpointType === undefined || endpointType === null || endpointType === EndpointTypes.API) {
            return configs.api.endpointTypeRootsApi;
        } else if (endpointType === EndpointTypes.DOCUMENTATION) {
            return configs.api.endpointTypeRootsDocumentation;
        } else if (endpointType === EndpointTypes.DIAGNOSTICS) {
            return configs.api.endpointTypeRootsDiagnostics;
        } else if (endpointType === EndpointTypes.NONE) {
            return "";
        } else {
            throw Error(`Invalid endpoint type : ${endpointType}`);
        }
    }

    /**
     * Make sure a file is safe to delete, that is:
     * - It is truly
     * - It is not the path of a root directory or file
     */
    isSafeToDelete(path: string): boolean {

        if (!path) {
            return false;
        }

        path = pathUtils.normalize(path);

        path = path.replace(/\\/g, "/");
        path = _.trimEnd(path, "/ ");

        return (path.match(/\//g) || []).length > 1;
    }

    async deleteFile(filePath: string) {

        if (!this.isSafeToDelete(filePath)) {
            throw new Error("Unsafe file to delete. A file to delete can't be at the root.");
        }

        return new Promise(function (resolve, reject) {
            rimraf(filePath, () => {
                resolve();
            });
        });
    }

    async deleteDir(dirPath: string) {

        if (!this.isSafeToDelete(dirPath)) {
            throw new Error("Unsafe dir to delete. A dir to delete can't be at the root.");
        }

        let self = this;

        return new Promise(async function (resolve, reject) {

            try {
                rimraf(dirPath, () => {
                    resolve();
                });
            } catch (err) {

                //==========================================
                // Try recursively as rimraf may sometimes
                // fail in infrequent situations...
                //==========================================
                await (self.clearDir(dirPath));
                await new Promise(function (resolve, reject) {
                    rimraf(dirPath, () => {
                        resolve();
                    });
                });
            }
        });
    }

    async clearDir(dirPath: string) {

        let self = this;

        if (!this.isSafeToDelete(dirPath)) {
            throw new Error("Unsafe dir to clear. A dir to clear can't be at the root.");
        }

        return await globby([dirPath + "/*", dirPath + "/.*"]).then(async (paths: string[]) => {
            for (let filePath of paths) {
                if (fs.lstatSync(filePath).isDirectory()) {
                    await self.deleteDir(filePath);
                } else {
                    await self.deleteFile(filePath);
                }
            }
        });
    }

    getDefinedOrNull(el: any): any {

        if (el === undefined) {
            return null;
        }
        return el;
    }

}
export let utils: IUtils = new Utils();
