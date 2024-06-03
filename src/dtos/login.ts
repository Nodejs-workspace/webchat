import constants from "../constants";
import { IUser } from "../databases/models/user";

export default class LoginDTO {
    public email: string;
    public password: string;

    constructor(data: IUser) {
        this.email = data.email;
        this.password = data.password ?? constants.DEFAULTS.EMPTY.STRING();
    }
}
