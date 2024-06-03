import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/customRequest";

export default class HomeController {
    public async getHomeView(req: CustomRequest, res: Response, _next: NextFunction) {
        const siteUrl = `${req.protocol}://${req.get("host")}`;
        const layout = "./layouts/default.layout.ejs";
        const options = {
            layout,
            siteUrl,
            title: "Web Chat 2",
        };
        return res.render("index/index", options);
    }
}
