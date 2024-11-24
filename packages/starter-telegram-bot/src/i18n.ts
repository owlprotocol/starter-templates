import { I18n } from "@grammyjs/i18n";
import { MyContext } from "./context.js";

export const i18n = new I18n<MyContext>({
    defaultLocale: "en",
    useSession: true, // whether to store user language in session
    directory: "locales", // Load all translation files from locales/.
});
