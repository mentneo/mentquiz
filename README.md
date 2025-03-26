# Engineering Quiz Application

## Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- A Firebase account with the project set up

## Installation Steps

1. **Navigate to the project directory**
   ```bash
   cd "/Users/yeduruabhiram/Desktop/untitled folder"
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or if you use yarn
   yarn install
   ```

3. **Firebase Configuration**
   Your Firebase configuration is already set up in `src/firebase/config.js`. Make sure:
   - The Firebase project is active
   - Authentication with Email/Password and Google Sign-In methods are enabled
   - Firestore Database is created and rules are set to allow read/write

   **Enable Firebase Services:**
   - Go to Firebase Console: https://console.firebase.google.com/
   - Select your project: "quiz-c2d60"
   - Go to Authentication → Sign-in methods
   - Enable Email/Password and Google authentication methods

   **Set up Firestore Security Rules:**
   - Go to Firebase Console: https://console.firebase.google.com/
   - Select your project: "quiz-c2d60"
   - Go to Firestore Database → Rules
   - Replace the existing rules with the following:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write;
         }
       }
     }
     ```
   - Click "Publish"

4. **Start the development server**
   ```bash
   npm start
   # or if you use yarn
   yarn start
   ```

5. **Access the application**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Admin User Setup and Login

### Step 1: Create a regular user account
1. Go to the application at http://localhost:3000
2. Click on "Sign Up" in the navigation bar
3. Enter your email and password 
4. Complete the registration process
5. You will be logged in as a student user by default

### Step 2: Promote the user to admin in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: "quiz-c2d60"
3. In the left sidebar, click on "Firestore Database"
4. Find the "users" collection
5. Locate your user document (you can search by your email address)
6. Click on the document to open it
7. Find the "role" field (it should be set to "student")
8. Click the edit icon (pencil) next to the field
9. Change the value from "student" to "admin"
10. Click "Update" or "Save" to confirm the change

### Step 3: Log in as admin
1. Go back to the application
2. If you're already logged in, click on your email in the top-right corner and select "Logout"
3. Log in again using your email and password
4. You will now be automatically redirected to the Admin Dashboard

### Admin Features
As an admin user, you can:
- Create new quizzes
- Edit existing quizzes
- Delete quizzes
- View all student quiz attempts and results

## Creating an Admin User (Manual Process)

Follow these steps to create an admin user:

1. **Sign up a new user**
   - Go to the application and sign up using email and password
   - Note the email address used for registration

2. **Access Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select your project "quiz-c2d60"

3. **Navigate to Firestore Database**
   - In the left sidebar, click on "Firestore Database"

4. **Find the user document**
   - Look for a collection called "users"
   - Find the document that corresponds to the user you just created
   - You can identify it by the email field

5. **Edit the user document**
   - Click on the document to open it
   - Find the "role" field, which should currently be set to "student"
   - Click on the edit icon (pencil) next to the field
   - Change the value to "admin"
   - Save the changes

6. **Test admin access**
   - Go back to the application
   - Log out if you're already logged in
   - Log in with the admin user credentials
   - You should now be redirected to the admin dashboard
   - If not, refresh the page

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects the app from create-react-app

## Project Structure
- `/src/components/Admin` - Admin dashboard components
- `/src/components/Auth` - Authentication components
- `/src/components/Student` - Student dashboard and quiz components
- `/src/components/Common` - Shared UI components
- `/src/contexts` - React contexts (Authentication)
- `/src/firebase` - Firebase configuration
- `/src/styles` - CSS styles

## Troubleshooting

If you encounter issues:

1. **Firebase Connection Errors**
   - Check that your Firebase configuration in `firebase/config.js` is correct
   - Ensure Firebase services are enabled in Firebase Console

2. **Permission Denied Errors**
   - Make sure you've updated the Firestore security rules as described above
   - These errors often occur when the rules are too restrictive

3. **Authentication Errors**
   - If you see "auth/email-already-in-use" errors, that email is already registered
   - Try logging in instead, or use a different email address
   - Ensure Authentication is enabled in Firebase Console

4. **User Role Not Working**
   - Check if the user document exists in Firestore Database
   - Verify the "role" field is correctly set to "admin" or "student"
   - Try logging out and back in after making changes

## Firebase Setup - Important!

### Firestore Security Rules
Make sure to update the Firestore security rules as described in the Installation Steps section.

### Firestore Indexes
This application requires a composite index for proper functionality:

1. If you encounter an error saying "The query requires an index", you'll see a URL in the error message
2. Click on that URL to go to Firebase Console and create the required index
3. Alternatively, follow these steps manually:
   - Go to Firebase Console: https://console.firebase.google.com/
   - Select your project "quiz-c2d60"
   - Navigate to Firestore Database → Indexes
   - Click "Add Index"
   - Collection ID: "attempts"
   - Fields to index:
     - Field path: "studentId", Order: Ascending
     - Field path: "attemptDate", Order: Descending
   - Query scope: Collection
   - Click "Create"
4. Wait for the index to build (can take a few minutes)
5. Refresh your application

5. **Missing Firestore Index Error**
   - If you see an error about "query requires an index", click the link in the error message to create the needed index
   - Alternatively, follow the "Firestore Indexes" instructions in this README
   - It can take a few minutes for new indexes to be built and become available
