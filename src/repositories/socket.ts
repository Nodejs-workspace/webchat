import socketIo, { Server } from "socket.io";
import http from "http";
import { EVENT_REQUEST_TYPE_ENUM } from "../enums/sockets/eventRequestType";

export default class SocketRepository {
    public static io: socketIo.Server;

    public async add(server: http.Server) {
        if (SocketRepository.io) return SocketRepository.io;
        const io = new Server(server);
        SocketRepository.io = io;
        return SocketRepository.io;
    }

    public async send(socketId: string, message: unknown) {
        return SocketRepository.io.to(socketId).emit(EVENT_REQUEST_TYPE_ENUM.MESSAGE, message);
    }
}
