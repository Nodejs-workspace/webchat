import { NODE_ENVIRONMENT_ENUM } from "../enums/nodeEnv";

export interface IServerConfig {
    DATABASE_URL: string;
    EXPRESS_SESSION_SECRET: string;
    NODE_ENV: NODE_ENVIRONMENT_ENUM;
    PORT: number;
    SITE_URL: string;
    DB_NAME: string;
    SECRET_KEY: string;
    ORIGIN: string;
}

const serverConfig: IServerConfig = {
    PORT: process.env.PORT ?? 3000,
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    SECRET_KEY: process.env.SECRET_KEY ?? "",
    SITE_URL: process.env.SITE_URL ?? "",
    DB_NAME: process.env.DB_NAME ?? "",
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET ?? "",
    ORIGIN: process.env.ORIGIN ?? "",
    NODE_ENV: <NODE_ENVIRONMENT_ENUM>process.env.NODE_ENV ?? NODE_ENVIRONMENT_ENUM.DEVELOPMENT,
};

export default serverConfig;
