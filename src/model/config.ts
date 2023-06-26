import { FirebaseApp } from "@firebase/app";

export interface FeedbackModuleConfig {
  firebaseApp: FirebaseApp;
  reviewCollectionPath: string;
}
