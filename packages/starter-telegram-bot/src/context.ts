/* eslint-disable @typescript-eslint/no-empty-interface */
import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import type { I18nFlavor } from "@grammyjs/i18n";
import type { Context } from "grammy";

export interface MySessionState {
    counter: number;
}

// For conversation support, you need to define a custom context type
export type MyContext = Context &
    ConversationFlavor &
    I18nFlavor & {
        session: MySessionState;
    };

// Define the conversation type
export type MyConversation = Conversation<MyContext>;
