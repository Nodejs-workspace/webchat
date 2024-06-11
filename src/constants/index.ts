import session from "express-session";

import serverConfig from "./serverConfig";

export default {
    ROUTER_PATH: {
        APIS: {
            V1: "/v1",
            API_ROUTE: "routes/apis",
            VIEWS_ROUTE: "routes/views",
            BASE_PATH: "/api",
            INDEX: "/",
            USER_ROOMS: "/rooms",
            ID_PARAM: "/:id",
            USER_IMAGE_BY_ID: "/:id/image",
            USER_BY_EMAIL: "/email/:email",
            UPLOAD_IMAGE_BY_ID: "/:id/upload",
            USERS: "/users",
            ROOMS: "/rooms",
            MESSAGES: "/messages",
            GROUPS: "/groups",
            PROFILE: "/profile",
            USER: "/user",
            DOCS: "/docs",
            LOGIN: "/login",
        },
        VIEWS: {
            BASE_PATH: "/web-chat",
            INDEX: "/",
            USERS: "/users",
            ROOMS: "/rooms",
            MESSAGES: "/messages",
            GROUPS: "/groups",
            PROFILE: "/profile",
            ID_PARAM: "/:id",
            USER: "/user",
        },
        PUBLIC: "/public",
    },

    DEFAULTS: {
        EMPTY: {
            STRING: () => "",
            OBJECT: () => {
                return {};
            },
            ARRAY: <T>() => {
                return [] as Array<T>;
            },
        },
        BOOLEAN: {
            TRUE: () => true,
            FALSE: () => false,
        },
        ONE_DAY_IN_MILI_SECOND: 24 * 60 * 60 * 1000,
        STRING: {
            GROUPS: () => "groups",
            API_BASE_LOGIN_URL: () => "/api/v1/users/email",
            API_BASE_SIGN_UP_URL: () => "/api/v1/users",
            TITLE: () => "Web Chat",
            IMAGE: () => "image",
        },
    },
    MONGOOSE: {
        LIMIT: 30,
        TOKEN_EXPIRES_TIME: "5 minutes",
        COLLECTION: {
            USERS: {
                NAME: "users",
            },
            GROUPS: {
                NAME: "groups",
            },
            ROOMS: {
                NAME: "rooms",
            },
            MESSAGES: {
                NAME: "messages",
            },
        },
    },
    EXPRESS_SESSION: () =>
        <session.SessionOptions>{
            secret: serverConfig.EXPRESS_SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            unset: "destroy",
        },
    SWAGGER: {
        TITLE: "API DOCUMENTATION",
        VERSION: "1.0.0",
        DESCRIPTION: "This is the Api documentation for WebChat Applications.",
    },
    ARRAY: { INDEX: { LAST: -1 } },
};
