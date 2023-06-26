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
  where,
} from "firebase/firestore";
import { FeedbackModuleConfig as FeedBackModuleConfig } from "./config";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";

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
    replierName: data.reviewerName,
    replierImageUrl: data.reviewerImageUrl,
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
    const { firebaseApp, reviewCollectionPath } = config;
    const db = getFirestore(firebaseApp);
    const reviewsCollectionRef = collection(
      db,
      reviewCollectionPath,
      reply.reviewUid,
      "replies"
    );

    const newReviewDocRef = doc(reviewsCollectionRef);
    await setDoc(newReviewDocRef, ReplyToFirestore(reply));

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
    const { firebaseApp, reviewCollectionPath } = config;
    const db = getFirestore(firebaseApp);
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
