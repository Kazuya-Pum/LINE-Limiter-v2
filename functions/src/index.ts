import * as Login from "./login";
import * as Webhook from "./webhook";
import * as Notify from "./notify";
import * as admin from "firebase-admin";
admin.initializeApp();

export const login = Login.login;
export const webhook = Webhook.webhook;
export const notify = Notify.checkNotifications;
