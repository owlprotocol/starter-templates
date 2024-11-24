# Starter Telegram Bot

Example Grammy JS Bot Project

## TODO

-   More instructions on handling envvars.
-   Testing

## Frameworks

-   [GrammyJS](https://grammy.dev/): Bot Framework
-   GrammyJS [Conversations](https://grammy.dev/plugins/conversations): Plugin for imperative conversational bot flows
-   Firebase [Firestore](https://firebase.google.com/docs/firestore): GrammyJS [Session Storage](https://github.com/grammyjs/storages/tree/main/packages/firestore)
-   Firebase [Functions](https://firebase.google.com/docs/functions): GrammyJS [Hosting](https://grammy.dev/hosting/firebase#hosting-firebase-functions) as webhook

## Architecture

This starter bot is designed to serve as a template for production deployments. The session info is persisted in Firestore and the bot is hosted on Firebase Functions for dynamic scalability using the Telegram Bot Webhooks.

## Local Development

For local development, we use Firebase Emulator for Firestore & Functions services.

### Standard

For local development you can use the standard Grammy `bot.start()` runtime (see [src/runtimes/grammy.ts](./src/runtimes/grammy.ts)). This will only need Firestore and **not** Functions.

```bash
pnpm run firebase-emulator:firestore # Start Firestore
pnpm run dev:grammy # Start Grammy bot
```

### Firebase Functions

To test things out closer to production, you can also run the bot in the "firebase" runtime that will use Firebase Functions (see [src/runtimes/firebase.ts](./src/runtimes/firebase.ts)). However, this will **require you to set a reverse proxy** like [ngrok](https://ngrok.com) to make your local emulator accessible.

```bash
ngrok http --domain=<your-ngrok-domain>.ngrok-free.app 5001 # Set ngrok reversle proxy
pnpm exec tsx src/scripts/setWebhook.ts # Set Webhook
pnpm run dev:firebase # Start Firestore & Functions (bot will run)
```

## Production Deployment

For production deployments, we deploy the firebase function.

```bash
pnpm run deploy:firebase
```
