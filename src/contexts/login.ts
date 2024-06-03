import LoginController from "../controllers/login";

export default class LoginContext {
    public static getControllerContext() {
        const loginController = new LoginController();
        return loginController;
    }
}
