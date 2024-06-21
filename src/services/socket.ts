import { Server } from "http";
import socketIo, { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import logger from "../helpers/logger";
import ProcessService from "./process";
import SocketRepository from "../repositories/socket";
import { ChatMessage } from "../types/sockets/chatMessage";
import { EVENT_REQUEST_TYPE_ENUM } from "../enums/sockets/eventRequestType";

export default class SocketService {
    private readonly _socketRepository: SocketRepository;
    private readonly _processService: ProcessService;

    constructor(socketRepository: SocketRepository, processService: ProcessService) {
        this._socketRepository = socketRepository;
        this._processService = processService;
    }

    public async initialize(server: Server): Promise<void> {
        const io: socketIo.Server = await this._socketRepository.add(server);

        io.use((socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>, next) => {
            // remove all the previous listeners
            socket.removeAllListeners();
            return next();
        });

        io.on(
            EVENT_REQUEST_TYPE_ENUM.CONNECTION,
            (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>): void => {
                logger.info("new connection");

                if (!socket.connected) return;

                // ADDING LISTENER TO THE SOCKET
                socket.on(EVENT_REQUEST_TYPE_ENUM.MESSAGE, async (body: ChatMessage): Promise<void> => {
                    logger.info(`${socket.id} == ${JSON.stringify(body)}`);
                    await this._processService.processMessage(body);
                });
            },
        );
        io.on(
            EVENT_REQUEST_TYPE_ENUM.DISCONNECT,
            (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>) => {
                logger.info(`socket connection disconnect with ${socket.id}`);
            },
        );
    }

    public async send(socketId: string, message: unknown) {
        return this._socketRepository.send(socketId, message);
    }
}
