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
            USER_GROUPS_BY_ROOM_ID: "/rooms/:roomId",
            USER_ROOMS: "/rooms",
            ID_PARAM: "/:id",
            MESSAGE_BY_GROUP_ID: "/group/:groupId",
            USER_IMAGE_BY_ID: "/:id/image",
            USER_BY_EMAIL: "/email/:email",
            UPLOAD_IMAGE_BY_ID: "/:id/upload",
            USERS: "/users",
            ROOMS: "/rooms",
            ROOM_ID_PARAM: "/:roomId",
            MESSAGE: "/message",
            GROUPS: "/groups",
            PROFILE: "/profile",
            USER: "/user",
            DOCS: "/docs",
        },
        VIEWS: {
            API_BASE_PATH: "/api/v1",
            API_ROUTE: "routes/apis",
            VIEWS_ROUTE: "routes/views",
            BASE_PATH: "/web-chat",
            INDEX: "/",
            USER_GROUPS_BY_ROOM_ID: "/rooms/:roomId",
            USER_ROOMS: "/rooms",
            GROUP_ID_PARAM: "/:groupId",
            MESSAGE_BY_GROUP_ID: "/group/:groupId",
            USER_ID_PARAM: "/:userId",
            USER_IMAGE_BY_ID: "/:userId/image",
            USER_BY_EMAIL: "/email/:email",
            UPLOAD_IMAGE_BY_USER_ID: "/:userId/upload",
            USERS: "/users",
            ROOMS: "/rooms",
            ROOM_ID_PARAM: "/:roomId",
            MESSAGE: "/message",
            GROUPS: "/groups",
            PROFILE: "/profile",
            USER: "/user",
            DOCS: "/docs",
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
        COLLLECTION: {
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
