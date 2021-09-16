import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, {Application, Request, Response} from "express";
import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TemplateMessage,
  MessageAPIResponseBase,
  User,
} from "@line/bot-sdk";
import {deleteCollection} from "./firebase";

const clientConfig: ClientConfig = {
  channelAccessToken: functions.config().line.token || "",
  channelSecret: functions.config().line.secret,
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: functions.config().line.token,
  channelSecret: functions.config().line.secret || "",
};

const client = new Client(clientConfig);

const app: Application = express();

const handleText = async (
    replyToken: string
): Promise<MessageAPIResponseBase | undefined> => {
  const response: TemplateMessage[] = [{
    type: "template",
    altText: "賞味期限管理BotのLINE Limiterです",
    template: {
      type: "buttons",
      text: "賞味期限管理BotのLINE Limiterです",
      actions: [
        {
          type: "postback",
          label: "Register",
          data: "yes",
        },
      ],
    },
  }];

  // Reply to the user.
  return await client.replyMessage(replyToken, response);
};

const register = async (storageId: string, userId: string) => {
  const storage = await admin
      .firestore()
      .collection("storages")
      .doc(storageId)
      .get();

  if (!storage.exists) {
    await admin
        .firestore()
        .collection("storages")
        .doc(storageId)
        .set({notice: 12});
  }

  await admin
      .firestore()
      .collection("storages")
      .doc(storageId)
      .collection("users")
      .doc(userId)
      .set({visible: true});
  return;
};

const unregister = async (storageId: string) => {
  await deleteCollection(`storages/${storageId}/foods`);
  await deleteCollection(`storages/${storageId}/users`);
  await admin
      .firestore()
      .collection("storages")
      .doc(storageId)
      .delete();
  return;
};

const left = async (storageId: string, members: User[]) => {
  await Promise.all(members.map(async (member) => {
    await admin
        .firestore()
        .collection("storages")
        .doc(storageId)
        .collection("users")
        .doc(member.userId)
        .delete();
    return;
  }));

  return;
};


const handleEvent = async (
    event: WebhookEvent
): Promise<MessageAPIResponseBase | void> => {
  if (
    "message" in event &&
    event.replyToken &&
    event.replyToken.match(/^(.)\1*$/)
  ) {
    console.log("Test hook recieved: " + JSON.stringify(event.message));
    return;
  }

  console.log(event.type, event.source);

  switch (event.type) {
    case "message": {
      const message = event.message;
      switch (message.type) {
        case "text":
          return handleText(event.replyToken);
        default:
          return;
      }
    }

    case "join":
      return handleText(event.replyToken);

    case "follow":
    case "memberJoined": {
      const userId = event.source.userId;
      if (!userId) {
        throw new Error("Undefined userId");
      }
      switch (event.source.type) {
        case "user":
          return await register(userId, userId);
        case "group":
          return await register(event.source.groupId, userId);
        case "room":
          return await register(event.source.roomId, userId);
        default:
          throw new Error("Unknown type");
      }
    }

    case "postback": {
      const userId = event.source.userId;
      if (!userId) {
        throw new Error("Undefined userId");
      }

      if (event.postback.data !== "yes") {
        return;
      }

      switch (event.source.type) {
        case "group":
          return await register(event.source.groupId, userId);
        case "room":
          return await register(event.source.roomId, userId);
        default:
          throw new Error("Unknown type");
      }
    }

    case "unfollow":
    case "leave":
      switch (event.source.type) {
        case "user":
          return await unregister(event.source.userId);
        case "group":
          return await unregister(event.source.groupId);
        case "room":
          return await unregister(event.source.roomId);
        default:
          throw new Error("Unknown type");
      }

    case "memberLeft":
      switch (event.source.type) {
        case "group":
          return await left(event.source.groupId, event.left.members);
        case "room":
          return await left(event.source.roomId, event.left.members);
        default:
          throw new Error("Unknown type");
      }

    default:
      return;
  }
};

app.get("/", (_: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Connected successfully!",
  });
});

app.post("/", middleware(middlewareConfig), (req: Request, res: Response) => {
  const events: WebhookEvent[] = req.body.events;

  Promise.all(events.map(handleEvent))
      .then(() => res.end())
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
});

export const webhook = functions.region("asia-northeast1").https.onRequest(app);
