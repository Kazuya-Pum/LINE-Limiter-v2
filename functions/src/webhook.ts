import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, {Application, Request, Response} from "express";
import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  Message,
  TemplateMessage,
  ImageMapMessage,
  MessageAPIResponseBase,
  User,
  TextMessage,
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
  const response: Message[] = [
    {
      type: "template",
      altText: "さっそく賞味期限の管理を始めましょう！",
      template: {
        type: "buttons",
        title: "こんにちは！賞味期限管理BotのLINE Limiterです！",
        text: "グループでの使用には各ユーザーが利用開始を押して登録する必要があります。\nさっそく賞味期限の管理を始めましょう！",
        thumbnailImageUrl: "https://line-limiter.web.app/img/logo.png",
        actions: [
          {
            type: "postback",
            label: "利用開始",
            data: "yes",
          },
        ],
      },
    } as TemplateMessage,
    {
      type: "text",
      text: "「メニュー」とメッセージを送信するとLINE Limiterを開くメニューを表示します",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "message",
              label: "メニュー",
              text: "メニュー",
            },
          },
        ],
      },
    } as TextMessage,
  ];

  // Reply to the user.
  return await client.replyMessage(replyToken, response);
};

const replayMenu = async (replyToken: string) => {
  const liffUrl = `https://liff.line.me/${functions.config().line.liff}`;

  const response: Message[] = [
    {
      type: "imagemap",
      baseUrl: "https://line-limiter.web.app/img/menu",
      altText: "LINE Limiter: メニュー",
      baseSize: {
        width: 1040,
        height: 1040,
      },
      actions: [
        {
          type: "uri",
          label: "食品の登録",
          linkUri: `${liffUrl}/add`,
          area: {
            x: 0,
            y: 0,
            width: 1040,
            height: 348,
          },
        },
        {
          type: "uri",
          label: "登録した食品の一覧",
          linkUri: `${liffUrl}/list`,
          area: {
            x: 0,
            y: 350,
            width: 1040,
            height: 348,
          },
        },
        {
          type: "uri",
          label: "設定",
          linkUri: `${liffUrl}/settings`,
          area: {
            x: 0,
            y: 800,
            width: 1040,
            height: 348,
          },
        },
      ],
    } as ImageMapMessage,
  ];

  return await client.replyMessage(replyToken, response);
};

const register = async (
    storageId: string,
    userId: string,
    replyToken?: string,
) => {
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


  if (replyToken) {
    const response: TextMessage[] = [{
      type: "text",
      text: "登録が完了しました！",
    }];

    await client.replyMessage(replyToken, response);
  }

  console.log(`register ${userId} at ${storageId}`);

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

  console.log(`unregist ${storageId}`);
  return;
};

const left = async (storageId: string, members: User[]) => {
  const done = await Promise.all(members.map(async (member) => {
    await admin
        .firestore()
        .collection("storages")
        .doc(storageId)
        .collection("users")
        .doc(member.userId)
        .delete();
    return member.userId;
  }));

  console.log(`left ${done} from ${storageId}`);

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
          if (message.text === "メニュー") {
            return await replayMenu(event.replyToken);
          }
          return;
        default:
          return;
      }
    }

    case "join":
      return await handleText(event.replyToken);

    case "follow": {
      const userId = event.source.userId;
      if (userId && event.source.type === "user") {
        return await register(userId, userId);
      } else {
        throw new Error("Unknown type");
      }
    }

    case "memberJoined": {
      const userId = event.source.userId;
      if (!userId) {
        throw new Error("Undefined userId");
      }

      switch (event.source.type) {
        case "group":
          return await register(event.source.groupId, userId, event.replyToken);
        case "room":
          return await register(event.source.roomId, userId, event.replyToken);
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
          return await register(event.source.groupId, userId, event.replyToken);
        case "room":
          return await register(event.source.roomId, userId, event.replyToken);
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
