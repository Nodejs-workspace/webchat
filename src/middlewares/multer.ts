import HttpStatus from "http-status-codes";
import Multer from "multer";

import { ExpressError } from "../helpers/expressError";

export default class MulterMiddleware {
    private readonly _storage: Multer.StorageEngine;
    private static instance: MulterMiddleware;

    constructor() {
        this._storage = Multer.memoryStorage();
    }

    static getInstance(): MulterMiddleware {
        if (!MulterMiddleware.instance) {
            MulterMiddleware.instance = new MulterMiddleware();
        }
        return MulterMiddleware.instance;
    }

    public uploadCsv() {
        const fileSize = 10 * 1024 * 1024;
        const multer = Multer({
            storage: this._storage,
            limits: {
                fileSize,
            },
            fileFilter(_req, file, cb) {
                if (!file.originalname.match(/\.(jpg|png|jpeg|img)$/)) {
                    return cb(new ExpressError(`only images files are allowed!`, HttpStatus.BAD_REQUEST));
                }
                cb(null, true);
            },
        });
        return multer.single("file");
    }
}
