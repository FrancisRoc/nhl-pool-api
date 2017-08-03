import { configs } from "../../config/configs";
import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { utils } from '../utils/utils';

var MongoClient = require("mongodb").MongoClient;

let logger = createLogger("dbConnectionService");

export interface IDbConnectionService {
    /**
     * Try connection to db multiple times and init values
     */
     mongoInit(): Promise<void>;

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

    public async mongoInit(): Promise<void> {

        let maxAttempts = 10;
        let currentAttempt = 1;
        let stopped = false;

        while (!stopped) {
            try {
                await this.connectToDb();
                stopped = true;
            }
            catch (connectionError) {
                if (currentAttempt <= maxAttempts) {
                    currentAttempt++;
                    await utils.sleep(3000);
                } else {
                    stopped = true;
                }
            }
        }
    }

    private async connectToDb(): Promise<void> {
        logger.info("Connecting to mongo db...");
        return new Promise<void>((resolve, reject) => {
            let connectString: string = configs.dataSources.mongodb.connectString;
            logger.info('Connecting to mongo at : ' + connectString);
            MongoClient.connect(connectString, function(error, db) {
                if (error) {
                    logger.error("Connection to mongo db failed:\n" + JSON.stringify(error));
                    reject(error);
                }
                logger.info('Connected to mongo db on ' + connectString);
                this.db = db;
                logger.debug("Connection à la base de données 'nhlPoolApp' a été établie");
                resolve();
            }.bind(this));
        });
    }

    public release() {
        this.db.close();
    }

    public getConnection() {
        return this.db;
    }
}
export let dbConnectionService: DbConnectionService = new DbConnectionService();