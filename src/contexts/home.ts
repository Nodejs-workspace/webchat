import HomeController from "../controllers/home";

export default class HomeContext {
    public static getControllerContext() {
        const homeController = new HomeController();
        return homeController;
    }
}
