import { FirebaseApp } from "@firebase/app";

export interface ReviewConfig {
  firebaseApp: FirebaseApp;
  reviewCollectionPath: string;
}
