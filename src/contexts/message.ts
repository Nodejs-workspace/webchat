import MessageController from "../controllers/message";
import GroupRepository from "../repositories/group";
import MessageRepository from "../repositories/message";
import UserRepository from "../repositories/user";
import GroupService from "../services/group";
import MessageService from "../services/message";
import UserService from "../services/user";

export default class MessageContext {
    public static getControllerContext() {
        const groupRepository = new GroupRepository();
        const groupService = new GroupService(groupRepository);
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const messageRepository = new MessageRepository();
        const messageService = new MessageService(messageRepository, userService, groupService);
        const messageController = new MessageController(messageService);
        return messageController;
    }
}
