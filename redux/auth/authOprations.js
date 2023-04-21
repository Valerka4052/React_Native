import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile,signOut  } from "firebase/auth";
import { auth } from "../../firebase/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signUp = createAsyncThunk(
  'authorisation/signUp',
  async function ({ name, email, password }) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      await updateProfile(user, { displayName: name,  });
      const userUpdateProfile = {
        nickName: user.displayName,
        userId: user.uid,
        email: user.email,
      };
      return userUpdateProfile;
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
      if(userCredential.user){
        const userUpdateProfile = {
          nickName: userCredential.user.displayName,
          userId: userCredential.user.uid,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
        };
        return userUpdateProfile;
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
    console.log(auth);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChangeeeeeeeeeed', user);
      if (user) {
        const userUpdateProfile = {
          nickName: user.displayName,
          userId: user.uid,
          email: user.email,
          profileImage: user.photoURL,
        };
        console.log('userUpdateProfile', userUpdateProfile);
        return userUpdateProfile;
      } else {
        return null;
      };
    });
  });
  
