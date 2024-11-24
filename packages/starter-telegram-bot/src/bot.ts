import { session } from "grammy";
import { TELEGRAM_BOT_TOKEN } from "./envvars.js";
import { getBot } from "./utils/getBot.js";
import { MyContext, MySessionState } from "./context.js";
import { ACTIVE_COMMANDS } from "./commands.js";

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN undefined");
}

//Middleware
/**
 * General middleware on all messages, not applicable to conversations but it can still trigger within a conversation if a user clicks a previous button.
 * Updates context and chatHistory
 * @param ctx
 * @param next
 */

/*
export async function onMessageMiddleware(
    ctx: MyContext,
    //@ts-expect-error
    next: NextFunction, // is an alias for: () => Promise<void>
): Promise<void> {
    console.debug(ctx.update);
    await next();
}
*/

export const bot = getBot<MySessionState, MyContext>({
    token: TELEGRAM_BOT_TOKEN,
    commands: ACTIVE_COMMANDS,
    session: session({
        initial: () => ({ counter: 0 }),
    }),
});
