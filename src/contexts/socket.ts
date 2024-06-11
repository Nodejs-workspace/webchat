import ProcessContext from "./process";
import SocketRepository from "../repositories/socket";
import SocketService from "../services/socket";

export default class SocketContext {
    public static getServiceContext() {
        const socketRepository = new SocketRepository();
        const processService = ProcessContext.getServiceContext();
        const socketService = new SocketService(socketRepository, processService);
        return socketService;
    }
}
