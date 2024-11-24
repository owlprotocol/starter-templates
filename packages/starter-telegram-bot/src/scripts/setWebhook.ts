import { TELEGRAM_BOT_WEBHOOK } from "../envvars.js";
import { bot } from "../bot.js";

//TODO: Add envvar
async function main() {
    if (!TELEGRAM_BOT_WEBHOOK) {
        throw new Error("TELEGRAM_BOT_WEBHOOK undefined");
    }
    return bot.api.deleteWebhook();
    // return bot.api.setWebhook(TELEGRAM_BOT_WEBHOOK);
}

main();
