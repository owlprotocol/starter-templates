/***** Commands *****/

import { Command } from "./utils/command.js";
import { settings, start } from "./conversations/index.js";
import { MyContext } from "./context.js";

export const START = {
    category: "intro",
    command: "start",
    description: "Start from the beginning",
    menu: false,
    conversation: start,
} as const satisfies Command<MyContext>;

export const SETTINGS = {
    category: "intro",
    command: "settings",
    description: "Start from the beginning",
    menu: true,
    conversation: settings,
} as const satisfies Command<MyContext>;

export const ACTIVE_COMMANDS: Array<Command<MyContext>> = [START, SETTINGS];
