declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            EXPRESS_SESSION_SECRET: string;
            NODE_ENV: "development" | "testing" | "production";
            PORT: number;
            SITE_URL: string;
            DB_NAME: string;
            SECRET_KEY: string;
            ORIGIN: string;
        }
    }
} // If this file has no import/export statements (i.e. is a script) // convert it into a module by adding an empty export statement.

export {};
