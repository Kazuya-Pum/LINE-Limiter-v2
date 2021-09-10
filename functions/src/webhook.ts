import * as functions from "firebase-functions";
import express, {Application, Request, Response} from "express";
import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
} from "@line/bot-sdk";

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

const textEventHandler = async (
    event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  // Process all variables here.
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  // Process all message related variables here.
  const {replyToken} = event;
  const {text} = event.message;

  // Create a new message.
  const response: TextMessage = {
    type: "text",
    text,
  };

  // Reply to the user.
  await client.replyMessage(replyToken, response);
  return;
};

app.get("/", async (_: Request, res: Response): Promise<Response> => {
  return res.status(200).json({
    status: "success",
    message: "Connected successfully!",
  });
});

app.post(
    "/webhook",
    middleware(middlewareConfig),
    async (req: Request, res: Response): Promise<Response> => {
      const events: WebhookEvent[] = req.body.events;

      // Process all of the received events asynchronously.
      const results = await Promise.all(
          events.map(async (event: WebhookEvent) => {
            try {
              await textEventHandler(event);
              return;
            } catch (err) {
              if (err instanceof Error) {
                console.error(err);
              }

              // Return an error message.
              return res.status(500).json({
                status: "error",
              });
            }
          })
      );

      // Return a successfull message.
      return res.status(200).json({
        status: "success",
        results,
      });
    }
);

export const webhook = functions.https.onRequest(app);
