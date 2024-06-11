import { NextFunction, Request, Response } from "express";

import createError from "http-errors";
import HttpStatus from "http-status-codes";

import { RESPONSE_STATUS } from "../enums/responseStatus";
import logger from "../helpers/logger";
import { ExpressError } from "../helpers/expressError";
import { ApiResponse } from "../types/customRequest";

export class ErrorMiddleware {
    private static _getErrorViewByHttpStatus(status: number): string {
        let view;

        switch (status) {
            case HttpStatus.NOT_FOUND:
                view = "errors/404";
                break;

            case HttpStatus.UNAUTHORIZED:
                view = "errors/401";
                break;

            case HttpStatus.FORBIDDEN:
                view = "errors/accessRequest";
                break;

            default:
                view = "errors/index";
                break;
        }

        return view;
    }

    public static notFoundHandle(_req: Request, _res: Response, next: NextFunction): void {
        return next(createError(HttpStatus.NOT_FOUND));
    }

    public static errorHandle(error: ExpressError, req: Request, res: Response, _next: NextFunction): void {
        // set locals, only providing error in development
        logger.error(error);
        res.locals.message = error.message;
        res.locals.error = req.app.get("env") === "development" ? error : {};
        const layout = "./layouts/errors/index.layout.ejs";
        const siteUrl = `${req.protocol}://${req.get("host")}`;
        const options = { layout, siteUrl, dbUser: undefined, error, title: "Web Chat 2" };
        // render the error page
        const status = error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

        if (status === HttpStatus.UNAUTHORIZED) return res.redirect(siteUrl);

        const view = ErrorMiddleware._getErrorViewByHttpStatus(status);
        return res.status(status).render(view, options);
    }

    public static apiErrorHandle(error: ExpressError, _req: Request, res: Response, _next: NextFunction): Response {
        logger.error(error);
        const response: ApiResponse<string> = {
            status: RESPONSE_STATUS.FAILED,
            message: error.message,
            data: error.message,
        };
        const status = error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        return res.status(status).send(response);
    }
}
