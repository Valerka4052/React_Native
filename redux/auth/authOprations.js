import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile,signOut  } from "firebase/auth";
import { app } from "../../firebase/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const auth = getAuth(app);

export const signUp = createAsyncThunk(
  'authorisation/signUp',
  async function ({ name, email, password }) {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      await updateProfile(user, { displayName: name });
      console.log(user);
       const userUpdateProfile = {
        nickName: user.displayName,
        userId: user.uid,
      };
      return userUpdateProfile
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    };
  },
);

export const signIn = createAsyncThunk(
  'authorisation/signIn',
  async function ({ email, password }) {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
      if(userCredential.user){
       const userUpdateProfile = {
        nickName: userCredential.user.displayName,
        userId: userCredential.user.uid,
      };
        return userUpdateProfile
      } else {
        return null;
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    };
  },
);

export const signOutUser = createAsyncThunk(
  'authorisation/signOut',
 function () {
   try {
      const auth = getAuth();
      signOut(auth);
      console.log('out');
    } catch (error) {
      console.log(error);
    };
  },
);

export const refreshStatus = createAsyncThunk(
  'authorisation/refreshStatus',
  async () => {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          const userUpdateProfile = {
        nickName: user.displayName,
        userId: user.uid,
      };
          resolve(userUpdateProfile);
        } else {
          resolve(null);
        }
      });
    });
  }
);
















// export const signIn = async ({ name, email, password }) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     console.log(userCredential);
//     return userCredential.user
    
//   } catch (error) {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   }
// };

export const logInF = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential);
    return userCredential.user
    
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

export const refreshUser = async () => {
  onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});
}

