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
import { ReviewConfig } from "./config";
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

export interface Review {
  uid: string;
  userUid: string;
  orderId: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  reviewerName: string;
  reviewerImageUrl?: string;
  reviewDateTime: Date;
  replies?: Review[];
  hasReply?: boolean;
}

export function ReviewFromFirestore(snapshot: DocumentSnapshot<any>): Review {
  const data = snapshot.data();

  const review: Review = {
    uid: snapshot.id,
    userUid: data.userUid,
    orderId: data.orderId,
    rating: data.rating,
    comment: data.comment,
    isPublic: data.isPublic,
    reviewerName: data.reviewerName,
    reviewerImageUrl: data.reviewerImageUrl,
    reviewDateTime: data.timestamp.toDate(),
    hasReply: data.hasReply ?? false,
  };

  return review;
}

export function ReviewToFirestore(review: Review): any {
  const {
    userUid,
    orderId,
    rating,
    comment,
    isPublic,
    reviewerName,
    reviewerImageUrl,
    reviewDateTime,
  } = review;
  const timestamp = Timestamp.fromDate(reviewDateTime);

  return {
    userUid,
    orderId,
    rating,
    comment,
    isPublic,
    reviewerName,
    reviewerImageUrl,
    timestamp,
  };
}

export async function PushReviewToFirebase(
  config: ReviewConfig,
  review: Review,
  onSuccess?: () => void,
  onFailure?: (error: unknown) => void
): Promise<boolean> {
  try {
    const { firebaseApp, reviewCollectionPath } = config;
    const db = getFirestore(firebaseApp);
    const reviewsCollectionRef = collection(db, reviewCollectionPath);

    const newReviewDocRef = doc(reviewsCollectionRef);
    await setDoc(newReviewDocRef, ReviewToFirestore(review));

    onSuccess?.();
    return true;
  } catch (error) {
    onFailure?.(error);
    return false;
  }
}

export async function GetRecentReviews(
  config: ReviewConfig,
  count: number,
  onSuccess?: () => void,
  onFailure?: (error: unknown) => void
): Promise<Review[]> {
  try {
    const { firebaseApp, reviewCollectionPath } = config;
    const db = getFirestore(firebaseApp);
    const reviewsRef = collection(db, reviewCollectionPath);

    const querySnapshot = await getDocs(
      query(reviewsRef, orderBy("timestamp", "desc"), limit(count))
    );

    const result = querySnapshot.docs.map((doc) => ReviewFromFirestore(doc));
    onSuccess?.();
    return result;
  } catch (error) {
    onFailure?.(error);
    return [];
  }
}

export async function GetReviewsOfOrder(
  config: ReviewConfig,
  orderUid: string,
  count: number,
  onSuccess?: () => void,
  onFailure?: (error: unknown) => void
): Promise<Review[]> {
  try {
    const { firebaseApp, reviewCollectionPath } = config;
    const db = getFirestore(firebaseApp);
    const reviewsRef = collection(db, reviewCollectionPath);

    const querySnapshot = await getDocs(
      query(
        reviewsRef,
        where("orderId", "==", orderUid),
        orderBy("timestamp", "desc"),
        limit(count)
      )
    );

    const result = querySnapshot.docs.map((doc) => ReviewFromFirestore(doc));
    onSuccess?.();
    return result;
  } catch (error) {
    onFailure?.(error);
    return [];
  }
}
