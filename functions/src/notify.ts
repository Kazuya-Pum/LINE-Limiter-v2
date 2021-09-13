import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  ClientConfig,
  Client,
  TemplateMessage,
  TemplateColumn,
} from "@line/bot-sdk";
import "firebase-functions";


const clientConfig: ClientConfig = {
  channelAccessToken: functions.config().line.token || "",
  channelSecret: functions.config().line.secret,
};

const client = new Client(clientConfig);


const pushNotify = async (
    storageId: string,
    msg: TemplateColumn[]
): Promise<void> => {
  if (msg.length === 0) {
    return;
  }

  const message: TemplateMessage = {
    type: "template",
    altText: "賞味期限が近づいています！",
    template: {
      type: "carousel",
      columns: msg.slice(0, 10),
    },
  };
  console.log(storageId, JSON.stringify(msg.slice(0, 10)));
  await client.pushMessage(storageId, message);

  return pushNotify(storageId, msg.slice(10));
};

const baseUri = `https://liff.line.me/${functions.config().line.liff}`;

const createMsg = (
    foodId: string,
    name: string,
    limit: number,
    img: string
): TemplateColumn => {
  return {
    title: name,
    text: new Date(limit).toISOString().substr(0, 10),
    thumbnailImageUrl: img || "https://line-limiter.web.app/img/logo.png",
    actions: [{
      type: "uri",
      label: "編集する",
      uri: `${baseUri}/add/${foodId}`,
    }],
  };
};

const execStorage = async (storageId: string, date: number) => {
  console.log(storageId);

  const msg = await admin.firestore()
      .collection("storages")
      .doc(storageId)
      .collection("foods")
      .where("enabled", "==", true)
      .get()
      .then((foods) => {
        const msg: TemplateColumn[] = [];

        foods.forEach((doc) => {
          const food = doc.data();
          if (
            food.notifications.includes(
                Math.floor((food.limit - date) / 86400000)
            )
          ) {
            msg.push(createMsg(doc.id, food.name, food.limit, food.img));
          }
        });
        return msg;
      });

  if (msg.length > 0) {
    return pushNotify(storageId, msg);
  } else {
    return;
  }
};


export const checkNotifications = functions
    .region("asia-northeast1")
    .pubsub.schedule("00 * * * *")
    .timeZone("Asia/Tokyo")
    .onRun(async () => {
      const jst = new Date().toLocaleString("ja-JP", {timeZone: "Asia/Tokyo"});

      const hour = new Date(jst).getHours();
      console.log(new Date(jst));

      const storages = await admin
          .firestore()
          .collection("storages")
          .where("notice", "==", hour)
          .get();

      if (storages.empty) {
        return null;
      }

      const date = Date.parse(new Date(jst).toISOString().substr(0, 10));

      await Promise.all(
          storages.docs.map((storage) => {
            return execStorage(storage.id, date);
          })
      );

      console.log("DONE");

      return null;
    });
