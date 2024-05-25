import GroupController from "../controllers/group";
import GroupRepository from "../repositories/group";
import GroupService from "../services/group";

export default class GroupContext {
    public static getControllerContext() {
        const groupRepository = new GroupRepository();
        const groupService = new GroupService(groupRepository);
        const groupController = new GroupController(groupService);
        return groupController;
    }
}
