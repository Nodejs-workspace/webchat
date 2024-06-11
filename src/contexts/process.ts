import GroupRepository from "../repositories/group";
import MessageRepository from "../repositories/message";
import UserRepository from "../repositories/user";
import GroupService from "../services/group";
import MemberService from "../services/member";
import MessageService from "../services/message";
import ProcessService from "../services/process";
import UserService from "../services/user";

export default class ProcessContext {
    public static getServiceContext() {
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const groupRepository = new GroupRepository();
        const groupService = new GroupService(groupRepository);
        const messageRepository = new MessageRepository();
        const messageService = new MessageService(messageRepository, userService, groupService);
        const memberService = new MemberService(userService, groupService, messageService);
        const processService = new ProcessService(memberService);
        return processService;
    }
}
