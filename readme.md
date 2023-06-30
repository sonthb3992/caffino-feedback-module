# CAFFINO FEEDBACK MODULE

*Welcome to the "caffino-feedback-module" package! This npm package simplifies the integration of feedback functionality into your web applications. With easy-to-use components and seamless Firebase integration, you can effortlessly collect and manage user feedback.*

# Key features

- **Firebase Integration:** Store and manage feedback securely with Firebase backend integration.
- **Configurable Options:** Fine-tune the module's behavior and appearance according to your requirements.
- **Easy Integration:** Seamlessly incorporate the module into new or existing web applications.
- **Handy components:** You have the flexibility to use the `ReviewComponent` that combines both the review form and the reviews item display. Alternatively, you can use the review form `ReviewForm` and the reviews item display `ReviewsOfOrderItem` separately based on your specific requirements. This allows you to easily integrate the components into your application, providing a seamless user experience for submitting reviews and displaying review items.”

# **Installation**

## **Prerequisites**

### **Step 1: Create a Firebase Project and save the configuration**

1. Follow Firebase's instructions to create a new project in the [Firebase Console](http://console.firebase.google.com/). This project will serve as the storage and management platform for your feedback data.
2. Enable `Firestore` for your project follow this [instruction](https://cloud.google.com/firestore/docs/create-database-web-mobile-client-library). 
3. Now that you have created the Firebase project and enabled `Firestore`, you can retrieve the Firebase configuration to use in your web app:
    1. From the project dashboard, click on the gear icon near the top left corner to access project settings.
    2. Scroll down to the "Your apps" section and click on the "Web" icon (**`</>`**).
    3. Provide an app nickname (e.g., "WebApp") and click on "Register app".
    4. Firebase will generate a configuration object containing your app's credentials.
    5. Copy the configuration object, which should look similar to the following and save it to a file of your project and export the configuration:
    
    ```jsx
    	// Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "your_auth_domain.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET.appspot.com",
      messagingSenderId: "YOUR_MESSAGE_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    export firebaseConfig;
    ```
    

### Step 2: **Install the Firebase SDK**

You can install the firebase SDK by running the following command in your project's root directory:

```jsx
npm install firebase
```

### Step 3: **Install the "caffino-feedback-module" package**

```jsx
npm install caffino-feedback-module
```

## ****Set up and RUN****

In case you don't have any available projects, you can use [our blank project](https://github.com/sonthb3992/feedback-consumer/tree/main) to test this module.

**You simply need to provide the `UserInfo`, `reviewConfig` and `orderID`.**

1. **Creating the `UserInfo` object**
    
    This object tell our feedback module which user is making the feedback or is replying to an existed feedback. To create  the `UserInfo` object, you can follow these steps:
    
    - If you’re using typescript: Import the `UserInfo` model from the `caffino-feedback-module` package into your project.
    - Create the object with information from logged in user from your existing system:
        
        **Typescript**:
        
        ```tsx
        // Dummy user information for testing purposes.
        // In a real application, this information would be fetched from the logged-in user's details
        // in the existing system.
        const dummyUserInfo: UserInfo = {
          userUid: "123456789", // Unique identifier for the user
          displayName: "John Doe", // Name or display name of the user
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/gemo-lab3.appspot.com/o/avatars%2FOIP.jpg?alt=media&token=dbe77a87-7623-4c48-8b7b-f980351e82bd", // URL of the user's profile image or avatar
          canReply: true, // Boolean value indicating whether the user can reply to reviews
        };
        ```
        
        **JavaScript**:
        
        ```tsx
        userInfo = {
              userUid: string. // The user's id (required)
              displayName: string. // The user's name (required)
              imageUrl: string. // The user's image profile picture url
              canReply: boolean. // Allow other customers to reply to the feedback or not? (required)
        };
        ```
        
2. **Creating the `ReviewConfig` object**
    
    This configuration enables the module to connect to your Firebase project.
    
    ***Steps:***
    
    1. If you’re using TypeScript: Import the `FeedbackModuleConfig` from the `caffino-feedback-module` package into your project.
    2. Create the object with information from the saved firebase config:
        
        **TypeScript:**
        
        ```tsx
        // The reviewConfig object specifies the Firebase configuration 
        // and the collection path for storing reviews.
        const reviewConfig: FeedbackModuleConfig = {
          firebaseConfig: firebaseConfig, // The Firebase configuration object
          reviewCollectionPath: "reviews_test", // The path to the collection in Firestore for storing reviews
        };
        ```
        
        **JavaScript:**
        
        ```tsx
        feedbackModuleConfig = {
             firebaseConfig: object. // The firebase config get from console.firebase.google.com (required)
             reviewCollectionPath: string. // the firebase's collection name. Can be anything (required)
        }
        ```
        
3. **Add the `ReviewComponent`**
    - Import the `ReviewComponent` from the "caffino-feedback-module" package into your project.
    - Incorporate the `ReviewComponent` into your desired page or component where you want to display the review functionality.
        
        ```tsx
        <ReviewComponent
          orderId="testOrderUid" // Specify the order ID or UID for the review component
          config={reviewConfig} // Pass the reviewConfig object containing the Firebase configuration and review collection path
          currentUser={dummyUserInfo} // Provide the current user's information using the dummyUserInfo object
        ></ReviewComponent>
        ```
        
4. **Run the project and config Firestore index**
    - Run your project and **create the first feedback using the feedback form**. The review will not appear after that because the query need an index to run.
    - Open your developer tools of your browser. You will find the error similar to this:
        
        ```tsx
        Error in GetReviewsOfOrder: FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/tesst-8313c/firestore/indexes?create_composite=ClBwcm9qZWN0cy90ZXNzdC04MzEzYy9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcmV2aWV3c190ZXN0L2luZGV4ZXMvXxABGgsKB29yZGVySWQQARoNCgl0aW1lc3RhbXAQAhoMCghfX25hbWVfXxAC
        ```
        
    - Login and save button. It may take a few minutes to build the index.
        
        ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e56491fb-f604-4376-b227-b5fc51512821/Untitled.png)
        
5. **Reload your feedback page** and you are done installing our feedback module.

# References

[Video Demo Modularization](https://drive.google.com/file/d/1sYswl3tr0mDPnoGr-atFaGOAMmmS9zV-/view?usp=sharing)