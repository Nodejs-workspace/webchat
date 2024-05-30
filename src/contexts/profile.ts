import ProfileController from "../controllers/profile";

export default class ProfileContext {
    public static getControllerContext() {
        const profileController = new ProfileController();
        return profileController;
    }
}
