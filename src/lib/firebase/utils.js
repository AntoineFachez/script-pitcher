// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/LIB/FIREBASE/UTILS.JS

import { FieldPath } from "firebase-admin/firestore";

// (The getDocsInBatches function remains the same as my previous answer)
export async function getDocsInBatches(collectionRef, ids) {
  if (!ids || ids.length === 0) {
    return [];
  }
  const batches = [];
  const batchSize = 30;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    const q = collectionRef.where(FieldPath.documentId(), "in", batchIds);
    batches.push(q.get());
  }
  const snapshots = await Promise.all(batches);
  const results = [];
  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
  });
  return results;
}
