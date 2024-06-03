import { NextFunction, Response } from "express";

import constants from "../constants";
import { CustomRequest, CustomSessionWithSessionData } from "../types/customRequest";

export default class ProfileController {
    async getProfileView(req: CustomRequest, res: Response, _next: NextFunction) {
        const siteUrl = `${req.protocol}://${req.get("host")}`;
        const { dbUser } = <CustomSessionWithSessionData>req.session;
        return res.render("profile", {
            title: constants.DEFAULTS.EMPTY.STRING(),
            origin: siteUrl,
            user: dbUser,
        });
    }
}
