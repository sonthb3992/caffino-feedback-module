import { getApp, initializeApp } from "firebase/app";

export const initializeAppIfNecessary = (firebaseConfig: any) => {
  try {
    const app = getApp();
    console.log("getApp success");
    return app;
  } catch (error) {
    console.log("Error: ", error);
  }

  try {
    const app = initializeApp(firebaseConfig);
    console.log("initializeApp success");
    return app;
  } catch (error) {
    console.log("Error: ", error);
  }
};
