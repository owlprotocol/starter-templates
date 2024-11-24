/***** Commands *****/

import { Conversation } from "@grammyjs/conversations";
import { Context } from "grammy";

/** Describes the parameter of a command */
export interface CommandParam {
    name: string;
    type: "string" | "number";
    description: string;
}

/**
 * Command defines a specific action that can be called using `/command` message
 */
export interface Command<C extends Context> {
    /* command */
    command: string;
    /* conversation */
    conversation: (conversation: Conversation<C>, ctx: C, ...params: any[]) => Promise<any>;
    /* display on menu */
    menu?: boolean;
    /* description for User (showed in menu and /help command) */
    description?: string;
    /* command category */
    category?: string;
}
