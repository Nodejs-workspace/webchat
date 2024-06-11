import socketIo, { Server } from "socket.io";
import http from "http";

export default class SocketRepository {
    public static io: socketIo.Server;

    public async add(server: http.Server) {
        if (SocketRepository.io) return SocketRepository.io;
        const io = new Server(server);
        SocketRepository.io = io;
        return SocketRepository.io;
    }
}
