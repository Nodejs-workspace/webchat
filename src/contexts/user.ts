import UserController from "../controllers/user";
import UserRepository from "../repositories/user";
import UserService from "../services/user";

export default class UserContext {
    public static getControllerContext() {
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const userController = new UserController(userService);
        return userController;
    }
}
