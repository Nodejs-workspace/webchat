import RoomController from "../controllers/room";
import RoomRepository from "../repositories/room";
import UserRepository from "../repositories/user";
import RoomService from "../services/room";
import UserService from "../services/user";

export default class RoomContext {
    public static getControllerContext() {
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const roomRepository = new RoomRepository();
        const roomService = new RoomService(roomRepository, userService);
        const roomController = new RoomController(roomService);
        return roomController;
    }
}
