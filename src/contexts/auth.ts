import AuthMiddleware from "../middlewares/auth";
import UserRepository from "../repositories/user";
import UserService from "../services/user";

export default class AuthContext {
    public static getMiddlewareContext() {
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const authMiddleware = new AuthMiddleware(userService);
        return authMiddleware;
    }
}
