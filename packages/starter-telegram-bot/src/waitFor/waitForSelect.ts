import type { CallbackQuery, Message } from "grammy/types";
import { Context, InlineKeyboard } from "grammy";
import type { Conversation } from "@grammyjs/conversations";
import { mapValues } from "lodash-es";
import { waitForCallbackQuery } from "./waitForCallbackQuery.js";

/**
 * Send a list of options to pick from as inline buttons
 * Uses the following
 * - `waitForSelect`
 * - `waitForCallbackQuery`
 * @param conversation
 * @param ctx
 * @param options Key-value of options mapped to data
 * @param messageIds to accept callbackQuery.data from
 * @param errorText for invalid inputs
 */
export async function waitForSelectWithInlineMessage<
    T extends Record<string, { name: string; data: any }> = Record<string, { name: string; data: any }>,
    C extends Context = Context,
>(
    conversation: Conversation<C>,
    ctx: C,
    options: T,
    replyText = "Please select an option",
    errorText = "Please select one of the options or /cancel",
): Promise<
    | {
          ctx: C;
          message: Message;
          selected: T[keyof T];
          cancel: false;
      }
    | {
          ctx: C;
          message: Message;
          selected: undefined;
          cancel: true;
      }
> {
    // Send reply with options inlined
    const keyboard = Object.entries(options).reduce(
        (acc, [key, option]) => acc.text(`${option.name}`, key),
        new InlineKeyboard(),
    );
    const replyMessage = await ctx.reply(replyText, { reply_markup: keyboard });

    // Wait for user selection
    const optionValues = mapValues(options, (v) => v.data);
    const result = await waitForSelect(conversation, ctx, optionValues, [replyMessage.message_id], errorText);

    // Delete original reply with options
    await result.ctx.api.deleteMessage(ctx.chatId!, replyMessage.message_id);

    return result;
}

/**
 * Send a list of options to pick from as individual messages with inline buttons
 * Uses the following
 * - `waitForSelect`
 * - `waitForCallbackQuery`
 * @param conversation
 * @param ctx
 * @param options Key-value of options mapped to data
 * @param messageIds to accept callbackQuery.data from
 * @param errorText for invalid inputs
 */
export async function waitForSelectWithMessages<
    T extends Record<string, { name: string; data: any }> = Record<string, { name: string; data: any }>,
    C extends Context = Context,
>(
    conversation: Conversation<C>,
    ctx: C,
    options: T,
    errorText = "Please select one of the options or /cancel",
): Promise<
    | {
          ctx: C;
          message: Message;
          selected: T[keyof T];
          cancel: false;
      }
    | {
          ctx: C;
          message: Message;
          selected: undefined;
          cancel: true;
      }
> {
    // Send replies with "Select" button
    const replyMessages = await Promise.all(
        Object.entries(options).map(([key, option]) => {
            return ctx.reply(option.name, { reply_markup: new InlineKeyboard().text("Select", key) });
        }),
    );

    // Wait for user selection
    const optionValues = mapValues(options, (v) => v.data);
    const result = await waitForSelect(
        conversation,
        ctx,
        optionValues,
        replyMessages.map((r) => r.message_id) as unknown as [number, ...number[]],
        errorText,
    );

    // Delete all messages except selected
    await Promise.all(
        replyMessages.map((message) => {
            if (result.message && message.message_id === result.message.message_id) {
                return result.ctx.api.editMessageReplyMarkup(ctx.chatId!, message.message_id, {
                    reply_markup: undefined,
                });
            } else {
                return result.ctx.api.deleteMessage(ctx.chatId!, message.message_id);
            }
        }),
    );

    return result;
}

/**
 * Wait for button user input and map to a KV of options
 * Uses the following
 * - `waitForCallbackQuery`
 * @param conversation
 * @param ctx
 * @param options Key-value of options mapped to data
 * @param messageIds to accept callbackQuery.data from
 * @param errorText for invalid inputs
 */
export async function waitForSelect<T extends Record<string, any> = Record<string, any>, C extends Context = Context>(
    conversation: Conversation<C>,
    ctx: C,
    options: T,
    messageIds: [number, ...number[]],
    errorText = "Please select one of the options or /cancel",
): Promise<
    | {
          ctx: C;
          message: Message;
          callbackQuery: CallbackQuery;
          data: keyof T;
          selected: T[keyof T];
          cancel: false;
      }
    | {
          ctx: C;
          message: Message;
          callbackQuery: undefined;
          data: undefined;
          selected: undefined;
          cancel: true;
      }
> {
    const response = await waitForCallbackQuery(conversation, ctx, messageIds, errorText);
    if (response.cancel) {
        return { ...response, selected: undefined };
    }

    const data = response.data;
    if (options[data] === undefined) {
        // This should NEVER happen as the buttons should have callbackQuery.data defined
        throw new Error(
            `options[${data}] undefined. Make sure data for InlineKeyboard buttons aligns with keys of options ${Object.keys(
                options,
            )}`,
        );
    }

    return { ...response, selected: options[data] };
}
