import { connect, MongooseOptions, set } from "mongoose";

import serverConfig from "../constants/serverConfig";
import logger from "../helpers/logger";

const options: MongooseOptions = {
    strictQuery: true,
};

set(options);

export default class MongoDB {
    static async connect(uri: string) {
        try {
            await connect(uri, { dbName: serverConfig.DB_NAME });
            logger.info(`Database successfully connected!`);
        } catch (error) {
            logger.error(`Failed to the database`, error);
            // kill process if failed to connect to the database
            process.exit(1);
        }
    }
}
