import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import "firebase-functions";

const channelId = functions.config().line.id;

const axiosInstance = axios.create({
  baseURL: "https://api.line.me",
  responseType: "json",
});

const verifyToken = async (accessToken: string) => {
  const response = await axiosInstance.get("/oauth2/v2.1/verify", {
    params: {access_token: accessToken},
  });
  if (response.status !== 200) {
    console.error(response.data.error_description);
    throw new Error(response.data.error);
  }
  if (response.data.client_id !== channelId) {
    throw new Error("client_id does not match.");
  }
  if (response.data.expires_in < 0) {
    throw new Error("access token is expired.");
  }
};

const getProfile = async (accessToken: string) => {
  const response = await axiosInstance.get("/v2/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {},
  });
  if (response.status !== 200) {
    console.error(response.data.error_description);
    throw new Error(response.data.error);
  }
  return response.data;
};

export const login = functions
    .region("asia-northeast1").https.onCall(async (data) => {
      const {accessToken} = data;
      try {
        await verifyToken(accessToken);
        const profile = await getProfile(accessToken);
        const token = await admin.auth().createCustomToken(profile.userId);

        const storage = await admin
            .firestore()
            .collection("storages")
            .doc(profile.userId)
            .get();

        if (!storage.exists) {
          await admin
              .firestore()
              .collection("storages")
              .doc(profile.userId)
              .set({notice: 12});
        }

        await admin
            .firestore()
            .collection("storages")
            .doc(profile.userId)
            .collection("users")
            .doc(profile.userId)
            .set({visible: true});
        return {token};
      } catch (err) {
        console.error(err);
        return {error: err instanceof Error ? err.message : err};
      }
    });
