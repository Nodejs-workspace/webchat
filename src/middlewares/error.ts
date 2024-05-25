import { NextFunction, Request, Response } from "express";

import createError from "http-errors";
import HttpStatus from "http-status-codes";

import logger from "../helpers/logger";
import { ExpressError } from "../helpers/expressError";

export class ErrorMiddleware {
    static notFoundHandle(_req: Request, _res: Response, next: NextFunction): void {
        return next(createError(HttpStatus.NOT_FOUND));
    }

    static errorHandle(error: ExpressError, req: Request, res: Response, _next: NextFunction): void {
        // set locals, only providing error in development
        logger.error(error);
        res.locals.message = error.message;
        res.locals.error = req.app.get("env") === "development" ? error : {};
        const layout = "./layouts/default.layout.ejs";
        const siteUrl = `${req.protocol}://${req.get("host")}`;
        const options = { layout, siteUrl, dbUser: undefined, error };
        // render the error page
        const status = (<ExpressError>error).status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const view =
            status === HttpStatus.NOT_FOUND
                ? "errors/404"
                : status === HttpStatus.UNAUTHORIZED
                  ? "errors/401"
                  : "errors/error";
        return res.status(status).render(view, options);
    }

    static apiErrorHandle(error: ExpressError, _req: Request, res: Response, _next: NextFunction): Response {
        logger.error(error.stack);
        const code = error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message;
        return res.status(code).send({ error: { message } });
    }
}
