# Firebase Functions Starter

Firebase Functions starter project with build system handled by ESBuild.

Showcases various features

* Firebase Functions: Advanced configuration to avoid cold starts
* Firebase Hosting: Connect function to custom domain
* Secrets configuration: Load sensitive envvars in `process.env` and use async imports in case they are being used by other imports in global scope

## Configure Project

### Billing

Enable Blaze plan by going to https://console.firebase.google.com/u/0/project/PROJECT_ID/usage

### Secret Manager

Enable secret manager by visinting https://console.developers.google.com/apis/api/secretmanager.googleapis.com/overview?project=PROJECT_ID

### CLI

Configure the CLI.

```bash
firebase login #Login to CLI
firebase use --add #Add project to configure `.firebaserc`
```

## Build

Build distribution (single `index.ts` output) using esbuild + tsc. The distribution will be sent to Firebase for deployment

```bash
npm run build
```

## Add Secret

https://firebase.google.com/docs/functions/config-env?hl=en&gen=2nd#secret-manager

```bash
firebase functions:secrets:set SECRET_NAME
```

## Deploy

This technically re-runs the build (since it is part of `predeploy:firebase` in package.json)

```bash
npm run deploy:firebase
```
