import * as Login from "./login";
import * as Webhook from "./webhook";
import * as Notify from "./notify";
import * as Firebase from "./firebase";
import * as admin from "firebase-admin";
admin.initializeApp({storageBucket: "kazuya-pum.appspot.com"});

export const login = Login.login;
export const webhook = Webhook.webhook;
export const notify = Notify.checkNotifications;
export const deleteFile = Firebase.deleteFile;
export const deleteFiles = Firebase.deleteFiles;
