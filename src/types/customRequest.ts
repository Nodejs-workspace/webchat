import { Request } from "express";
import { Session } from "express-session";

import { IUserDocument } from "../databases/models/user";
import { EmptyObject } from "./emptyObject";

export type PathParams<T = EmptyObject> = T;
export type ApiResponse<T = EmptyObject> = { status: string; message: string; data: T | string | null };
export type RequestBody<T = EmptyObject> = T;
export type QueryParams<T = EmptyObject> = T;

export interface ISessionUser {
    name: string;
    email: string;
    password: string;
    token: string;
    city: string;
}

export type SessionData = {
    redirectTo: string;
    dbUser: IUserDocument;
    user: ISessionUser;
    previousUrl: string;
};
export type CustomSessionWithSessionData = Session & SessionData;
export type CustomSessionWithPartialSessionData = Session & Partial<SessionData>;
export type CustomRequest = Request & {
    session: CustomSessionWithPartialSessionData;
};

export type CustomAPIRequest<
    Path = EmptyObject,
    ResBody = EmptyObject,
    ReqBody = EmptyObject,
    Query = EmptyObject,
> = Request<Path, ResBody, ReqBody, Query> & {
    session: CustomSessionWithPartialSessionData;
};
