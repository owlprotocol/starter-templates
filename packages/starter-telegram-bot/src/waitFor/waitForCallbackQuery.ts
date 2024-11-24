import type { CallbackQuery, Message } from "grammy/types";
import { Context } from "grammy";
import type { Conversation } from "@grammyjs/conversations";

/**
 * Wait for button user input
 * - `callbackQuery.data` (Inline button)
 * Any other input (eg. Text, Audio, Image, File) will get rejected
 * @param conversation
 * @param ctx
 * @param messageIds to accept callbackQuery.data from
 * @param errorText for invalid inputs
 */
export async function waitForCallbackQuery<T extends string = string, C extends Context = Context>(
    conversation: Conversation<C>,
    ctx: C,
    messageIds: [number, ...number[]],
    errorText = "Please select one of the options or /cancel",
): Promise<
    | {
          ctx: C;
          message: Message;
          callbackQuery: CallbackQuery;
          data: T;
          cancel: false;
      }
    | {
          ctx: C;
          message: Message;
          callbackQuery: undefined;
          data: undefined;
          cancel: true;
      }
> {
    let errorMessage: Message.TextMessage | undefined;

    while (true) {
        // Wait for user input
        ctx = await conversation.wait();
        if (errorMessage) {
            // Sent error response previously, delete it
            await ctx.api.deleteMessage(ctx.chat!.id, errorMessage.message_id);
        }

        if (ctx.message?.text === "/cancel") {
            return {
                ctx,
                message: ctx.message,
                callbackQuery: undefined,
                data: undefined,
                cancel: true,
            };
        }

        const callbackQuery = ctx.callbackQuery;
        if (!callbackQuery) {
            // Non-callback update (eg. Text, File...)
            // Send error response
            errorMessage = await ctx.reply(errorText);
            // Delete user input
            if (ctx.chat?.id && ctx.message) {
                await ctx.api.deleteMessage(ctx.chat!.id, ctx.message?.message_id);
            }
            continue;
        }

        const message = callbackQuery.message;
        if (!message || !messageIds.includes(message.message_id)) {
            // conversation.log({ callbackQuery, message, messageIds });

            // Callback update from invalid message
            // Send error response
            errorMessage = await ctx.reply(errorText);
            continue;
        }

        // Find message selected
        const data = callbackQuery.data as T | undefined;

        if (data === undefined) {
            // This should NEVER happen as the buttons should have callbackQuery.data defined
            throw new Error(
                `Message ${message}.callbackQuery.data undefined. Make sure to set data for InlineKeyboard buttons`,
            );
        }

        return {
            ctx,
            message,
            callbackQuery,
            data,
            cancel: false,
        };
    }
}
