import { InlineKeyboard } from "grammy";
import { mapValues } from "lodash-es";
import { waitForSelect } from "../waitFor/index.js";
import { MyContext, MyConversation } from "../context.js";
import { i18n } from "../i18n.js";

export async function settings(conversation: MyConversation, ctx: MyContext) {
    conversation.log(await ctx.conversation.active());
    conversation.log("Test");
}

export async function start(conversation: MyConversation, ctx: MyContext) {
    await conversation.run(i18n.middleware());
    // Bot util - inline select
    // const result = await waitForSelectWithInlineMessage(conversation, ctx, {
    // "1": { name: "Option 1", data: "option1" },
    // "2": { name: "Option 2", data: "option2" },
    // });

    // Bot util - inline select
    // const result = await waitForSelectWithMessages(conversation, ctx, {
    // "1": { name: "Option 1", data: "option1" },
    // "2": { name: "Option 2", data: "option2" },
    // });
    //

    // Bot util - menu
    // Send reply with options inlined
    const options = {
        "1": { name: "Option 1", data: "option1" },
        "2": { name: "Option 2", data: "option2" },
        settings: { name: ctx.t("settings"), data: "settings" },
    } as const;
    const replyText = "Please select an option";
    const errorText = "Please select one of the options or /cancel";
    // const keyboard = Object.entries(options).reduce(
    // (acc, [key, option]) => acc.text(`${option.name}`, key),
    // new InlineKeyboard(),
    // );
    const keyboard = new InlineKeyboard()
        .text(options[1].name, "1")
        .row()
        .text(options[2].name, "2")
        .row()
        .text(options.settings.name, "settings");

    const replyMessage = await ctx.reply(replyText, { reply_markup: keyboard });

    // Wait for user selection
    const optionValues = mapValues(options, (v) => v.data);
    const result = await waitForSelect(conversation, ctx, optionValues, [replyMessage.message_id], errorText);

    // Delete original reply with options
    // await result.ctx.api.deleteMessage(ctx.chatId!, replyMessage.message_id);

    // Conversation log
    conversation.log(`selected ${result.selected}`);

    // if (result.selected === "settings") {
    // conversation.log(ctx);
    // await ctx.conversation.reenter()

    // conversation.log(result.ctx.conversation);
    // await result.ctx.conversation.enter("settings");
    // await conversation.skip();
    // }

    // Force Reply
    // const locale = ctx.from?.language_code;
    // await ctx.reply(getIntroMessage(locale), {
    // parse_mode: "Markdown",
    // reply_markup: { force_reply: true, input_field_placeholder: "Enter your message here" },
    // });

    // Manual conversation wait
    // IMPORTANT: Use new context object
    // https://stackoverflow.com/questions/76937418/conversation-touchs-other-sessions-in-grammy
    // ctx = await conversation.wait();

    // Inline Mode
    // const title = "Pick an option";
    // const options = ["Option 0", "Option 1"];
    // const keyboard = options.reduce((acc, option, idx) => acc.text(`${option}`, `${idx}`), new InlineKeyboard());
    // const msgPick = await ctx.reply(title, { reply_markup: keyboard });
    // const msgReply = await waitForText(conversation, ctx, z.string());
    // ctx = msgReply.ctx;

    // Delete message
    // await ctx.api.deleteMessage(ctx.chat!.id, msgPick.message_id);
    // if (msgReply.message) {
    // await ctx.api.deleteMessage(ctx.chat!.id, msgReply.message.message_id);
    // }

    // Session Data
    // const msg = ctx.message!.text!;
    // const count = ctx.session.counter++;
    // const msgEcho = await ctx.reply(`Echo: ${msg}\nCount ${count}`);
    // conversation.log(msgEcho);
}
