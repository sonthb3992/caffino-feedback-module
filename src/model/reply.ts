import {
  DocumentSnapshot,
  Timestamp,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FeedbackModuleConfig as FeedBackModuleConfig } from "./config";
import { initializeAppIfNecessary } from "./firebase";

export interface Reply {
  replyUid: string;
  userUid: string;
  reviewUid: string;
  comment: string;
  replierName: string;
  replierImageUrl?: string;
  replyDateTime: Date;
}

export function ReplyFromFireStore(snapshot: DocumentSnapshot<any>): Reply {
  const data = snapshot.data();

  const reply: Reply = {
    replyUid: snapshot.id,
    userUid: data.userUid,
    reviewUid: data.reviewUid,
    comment: data.comment,
    replierName: data.replierName,
    replierImageUrl: data.replierImageUrl,
    replyDateTime: data.timestamp.toDate(),
  };

  return reply;
}

export function ReplyToFirestore(reply: Reply): any {
  const {
    userUid,
    reviewUid,
    comment,
    replierName,
    replierImageUrl,
    replyDateTime,
  } = reply;

  const timestamp = Timestamp.fromDate(new Date(Date.now()));

  return {
    userUid,
    reviewUid,
    comment,
    replierName,
    replierImageUrl,
    replyDateTime,
    timestamp,
  };
}

export async function PushReplyToFirebase(
  config: FeedBackModuleConfig,
  reply: Reply,
  onSuccess?: () => void,
  onFailure?: (error: unknown) => void
): Promise<boolean> {
  try {
    const { firebaseConfig, reviewCollectionPath } = config;
    const app = initializeAppIfNecessary(firebaseConfig);
    if (!app) {
      console.log("App is null");
      return false;
    }
    const db = getFirestore(app);
    const reviewsCollectionRef = collection(
      db,
      reviewCollectionPath,
      reply.reviewUid,
      "replies"
    );

    const newReviewDocRef = doc(reviewsCollectionRef);
    await setDoc(newReviewDocRef, ReplyToFirestore(reply));

    const reviewRef = collection(db, reviewCollectionPath);
    const reviewDocRef = doc(reviewRef, reply.reviewUid);
    await updateDoc(reviewDocRef, {
      hasReply: true,
    });

    onSuccess?.();
    return true;
  } catch (error) {
    onFailure?.(error);
    return false;
  }
}

export async function GetReplies(
  config: FeedBackModuleConfig,
  reviewId: string,
  onSuccess?: () => void,
  onFailure?: (error: unknown) => void
): Promise<Reply[]> {
  try {
    const { firebaseConfig, reviewCollectionPath } = config;
    const app = initializeAppIfNecessary(firebaseConfig);
    if (!app) {
      console.log("App is null");
      return [];
    }

    const db = getFirestore(app);
    const repliesRef = collection(
      db,
      reviewCollectionPath,
      reviewId,
      "replies"
    );

    const querySnapshot = await getDocs(
      query(repliesRef, orderBy("timestamp", "desc"))
    );

    const result = querySnapshot.docs.map((doc) => ReplyFromFireStore(doc));
    onSuccess?.();
    return result;
  } catch (error) {
    onFailure?.(error);
    return [];
  }
}
