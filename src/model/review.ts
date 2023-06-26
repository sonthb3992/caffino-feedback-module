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
import { FeedbackModuleConfig } from "./config";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { initializeAppIfNecessary } from "./firebase";

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
  config: FeedbackModuleConfig,
  review: Review,
  onSuccess?: () => void,
  onFailure?: (error: unknown) => void
): Promise<boolean> {
  try {
    const { firebaseConfig, reviewCollectionPath } = config;
    const app = initializeAppIfNecessary(config.firebaseConfig);
    if (!app) {
      console.log("App is null");
      return false;
    }

    const db = getFirestore(app);
    const reviewsCollectionRef = collection(db, reviewCollectionPath);

    const newReviewDocRef = doc(reviewsCollectionRef);
    console.log("New review document reference:", newReviewDocRef); // Debugging statement
    await setDoc(newReviewDocRef, ReviewToFirestore(review));
    console.log("Review document successfully set in Firestore."); // Debugging statement

    onSuccess?.();
    console.log("PushReviewToFirebase succeeded."); // Debugging statement
    return true;
  } catch (error) {
    console.error("Error in PushReviewToFirebase:", error); // Debugging statement
    onFailure?.(error);
    return false;
  }
}

export async function GetRecentReviews(
  config: FeedbackModuleConfig,
  count: number,
  onSuccess?: () => void,
  onFailure?: (error: unknown) => void
): Promise<Review[]> {
  try {
    const { firebaseConfig, reviewCollectionPath } = config;
    const app = initializeAppIfNecessary(config.firebaseConfig);
    if (!app) {
      console.log("App is null");
      return [];
    }

    const db = getFirestore(app);
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
  config: FeedbackModuleConfig,
  orderUid: string,
  count: number,
  onSuccess?: () => void,
  onFailure?: (error: unknown) => void
): Promise<Review[]> {
  try {
    const { firebaseConfig, reviewCollectionPath } = config;
    console.log(firebaseConfig);
    const app = initializeAppIfNecessary(config.firebaseConfig);
    if (!app) {
      console.log("App is null");
      return [];
    }

    const db = getFirestore(app);
    const reviewsRef = collection(db, reviewCollectionPath);

    console.log("Fetching reviews for order:", orderUid); // Debugging statement
    const querySnapshot = await getDocs(
      query(
        reviewsRef,
        where("orderId", "==", orderUid),
        orderBy("timestamp", "desc"),
        limit(count)
      )
    );

    const result = querySnapshot.docs.map((doc) => ReviewFromFirestore(doc));
    console.log("Fetched reviews:", result); // Debugging statement
    onSuccess?.();
    return result;
  } catch (error) {
    console.error("Error in GetReviewsOfOrder:", error); // Debugging statement
    onFailure?.(error);
    return [];
  }
}
