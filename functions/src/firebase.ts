import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const deleteQueryBatch = async (
    db: FirebaseFirestore.Firestore,
    query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
    resolve: (value?: unknown) => void
) => {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
};

export const deleteCollection = async (
    collectionPath: string,
    batchSize = 500
): Promise<unknown> => {
  const db = admin.firestore();

  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
};

export const deleteFile = functions
    .region("asia-northeast1")
    .firestore
    .document("storages/{storageId}/foods/{foodId}")
    .onDelete((snap, context) => {
      const {storageId, foodId} = context.params;

      return admin.storage().bucket().file(`${storageId}/${foodId}`).delete();
    });

export const deleteFiles = functions
    .region("asia-northeast1")
    .firestore
    .document("storages/{storageId}")
    .onDelete((snap, context) => {
      const {storageId} = context.params;

      return admin.storage().bucket().deleteFiles({
        prefix: storageId,
      });
    });
