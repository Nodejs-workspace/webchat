import LoginController from "../controllers/login";
import UserRepository from "../repositories/user";
import LoginService from "../services/login";
import UserService from "../services/user";

export default class LoginContext {
    public static getControllerContext() {
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const loginService = new LoginService(userService);
        const loginController = new LoginController(loginService);
        return loginController;
    }
}
