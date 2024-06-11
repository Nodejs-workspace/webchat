import { USER_ROLE_ENM } from "../enums/users/role";
import logger from "../helpers/logger";
import MemberService from "./member";
import { ChatMessage } from "../types/sockets/chatMessage";

export default class ProcessService {
    private readonly _memberService: MemberService;

    constructor(memberService: MemberService) {
        this._memberService = memberService;
    }

    private async _processAdminMessage(body: ChatMessage): Promise<void> {
        logger.info(`processing admin message, ${JSON.stringify(body)}`);
    }

    private async _processMemberMessage(body: ChatMessage): Promise<void> {
        logger.info(`processing member message, ${JSON.stringify(body)}`);
        await this._memberService.message(body);
    }

    private async _processGuestMessage(body: ChatMessage): Promise<void> {
        logger.info(`processing member message, ${JSON.stringify(body)}`);
    }

    public async processMessage(body: ChatMessage): Promise<void> {
        switch (body.role) {
            case USER_ROLE_ENM.ADMIN:
                await this._processAdminMessage(body);
                break;

            case USER_ROLE_ENM.MEMBER:
                await this._processMemberMessage(body);
                break;

            case USER_ROLE_ENM.GUEST:
                logger.info("");
                await this._processGuestMessage(body);
                break;

            default:
                logger.info("");
        }
    }
}
