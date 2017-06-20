import { configs } from "../../config/configs";
import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";

var MongoClient = require("mongodb").MongoClient;

let logger = createLogger("dbConnectionService");

export interface IDbConnectionService {
    /**
     * Try to establish connection with mongodb
     */
    connect();

    /**
     * Release/close connection to mongodb
     */
    release();

    /**
     * Getter for mongodb connection
     */
    getConnection();
}

class DbConnectionService implements IDbConnectionService {
    //Encapsulate mongoDb connection
    private db: any;

    public connect() {
        MongoClient.connect(configs.dataSources.mongodb.connectString, function(error, db) {
            if (error) {
                throw error;
            }
            this.db = db;
            logger.debug("Connection à la base de données 'nhlPoolApp' a été établie");
        }.bind(this));
    }

    public release() {
        this.db.close();
    }

    public getConnection() {
        return this.db;
    }
}
export let dbConnectionService: DbConnectionService = new DbConnectionService();