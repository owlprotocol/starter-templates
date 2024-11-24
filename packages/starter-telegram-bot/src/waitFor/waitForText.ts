import type { Message } from "grammy/types";
import { z, ZodString, ZodTypeAny } from "zod";
import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";

/**
 * Wait for text user input
 * - `message.text` (Keyboard input)
 * - `callbackQuery.data` (Inline button)
 * Any other input (eg. Audio, Image, File) will get rejected
 * @template T Zod Validator type (defaults to ZodString)
 * @param conversation
 * @param ctx
 * @param validator for input (simply use `z.string()` for simple validation)
 **/
export async function waitForText<T extends ZodTypeAny = ZodString, C extends Context = Context>(
    conversation: Conversation<C>,
    ctx: C,
    validator: T,
): Promise<
    | {
          ctx: C;
          message?: Message;
          text: string;
          data: z.output<T>;
          cancel: false;
      }
    | {
          ctx: C;
          message?: Message;
          text: undefined;
          data: undefined;
          cancel: true;
      }
> {
    let errorMessage: Message.TextMessage | undefined;
    let text: string | undefined;
    let data: T | undefined;

    while (true) {
        //Wait for user input
        ctx = await conversation.wait();
        if (errorMessage) {
            //Sent error response previously, delete it
            await ctx.api.deleteMessage(ctx.chat!.id, errorMessage.message_id);
        }

        text = ctx.message?.text ?? ctx.callbackQuery?.data;
        if (text === "/cancel") {
            return {
                ctx,
                message: ctx.message,
                text: undefined,
                data: undefined,
                cancel: true,
            };
        }

        if (!text) {
            //Not text send error response and delete user input
            errorMessage = await ctx.reply(
                `${validator.description ?? "Text response"} required.\nPlease answer or /cancel`,
            );
            if (ctx.chat?.id && ctx.message) {
                await ctx.api.deleteMessage(ctx.chat!.id, ctx.message?.message_id);
            }
        } else {
            const result = validator.safeParse(text);
            if (result.success) {
                data = result.data;
                // Valid Text, break loop
                break;
            }

            //Invalid text
            const formatted = result.error.format();
            errorMessage = await ctx.reply(`${formatted._errors.join(", ")}\nPlease answer or /cancel`);
        }
    }

    return {
        ctx,
        message: ctx.message,
        text,
        data,
        cancel: false,
    };
}
