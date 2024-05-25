import AuthMiddleware from "../middlewares/auth";

export default class AuthContext {
    public static getMiddlewareContext() {
        const authMiddleware = new AuthMiddleware();
        return authMiddleware;
    }
}
