import type { Context, MiddlewareFn, SessionFlavor } from "grammy";
import { Bot, GrammyError, HttpError } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import type { ConversationFlavor } from "@grammyjs/conversations";
import type { Command } from "./command.js";

export interface GetBotParams<S, C extends Context> {
    token: string;
    webhookUrl?: string;
    commands: Command<C>[];
    session: MiddlewareFn<C & SessionFlavor<S>>;
}

//TODO: Make async?
/**
 * @template S Session
 * @param params
 * @returns
 */
export function getBot<
    S,
    C extends Context &
        ConversationFlavor & {
            session: S;
        } = Context &
        ConversationFlavor & {
            session: S;
        },
>(params: GetBotParams<S, C>): Bot<C> {
    const { token, webhookUrl, commands, session } = params;
    const bot = new Bot<C>(token);

    /***** Api Configuration *****/
    // Menu commands
    bot.api.setMyCommands(
        commands
            .filter((command) => command.menu)
            .map((command) => {
                return { command: command.command, description: command.description ?? command.command };
            }),
    );
    // Webhook
    if (webhookUrl) {
        bot.api.setWebhook(webhookUrl);
    } else {
        bot.api.deleteWebhook();
    }

    /***** Middleware Configuration *****/
    // Session Middleware
    bot.use(session);

    // bot.use(onMessageMiddleware);

    // Conversations plugin
    bot.use(conversations());

    // Create conversation, command, callbackQuery
    commands.forEach((command) => {
        if (command.conversation) {
            // Conversation, this takes priority over ALL middleware
            bot.use(createConversation(command.conversation, command.command));

            // Command, handles text messages like /start (if no conversation active or skip)
            bot.command(command.command, async (ctx) => {
                await ctx.conversation.exit();
                await ctx.conversation.enter(command.command);
            });

            // Callback Query, handles button presses like "Start" (if no conversation active or skip)
            bot.callbackQuery(command.command, async (ctx) => {
                await ctx.conversation.exit();
                await ctx.conversation.enter(command.command);
            });
        }
    });

    // Error handling
    bot.catch((err: any) => {
        const ctx = err.ctx;
        console.error(`Error while handling update ${ctx.update.update_id}:`);
        const e = err.error;
        if (e instanceof GrammyError) {
            console.error("Error in request:", e.description);
        } else if (e instanceof HttpError) {
            console.error("Could not contact Telegram:", e);
        } else {
            console.error("Unknown error:", e);
        }

        ctx.reply("An error occurred. Please try again.");
    });

    return bot;
}
