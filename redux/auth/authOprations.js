import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile,signOut, getAuth  } from "firebase/auth";
import { app, auth } from "../../firebase/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Alert } from "react-native";

export const signUp = createAsyncThunk(
  'authorisation/signUp',
  async function ({ name, email, password }) {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
        // .then(({ user }) => {
      // console.log('response', response.user);
      // const { email, uid } = response.user;
        const userUpdateProfile = {
          userId: response.user.uid,
          email: response.user.email,
        };
        return userUpdateProfile;
          
    } catch (error) {
      // console.log('error',error);
      const errorCode = error.code;
      const errorMessage = error.message;
     return Alert.alert(errorMessage);
    };
  },
);

export const signIn = createAsyncThunk(
  'authorisation/signIn',
  async function ({ email, password }) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // console.log('userCredential.user',userCredential.user);
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
      // console.log('error',error);
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert(errorMessage);
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
    //  console.log(error);
     Alert.alert(error);
    };
  },
);

export const refreshStatus = createAsyncThunk(
  'authorisation/refreshStatus',
  async () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUpdateProfile = {
          nickName: user.displayName,
          userId: user.uid,
          email: user.email,
          profileImage: user.photoURL,
        };
        return userUpdateProfile;
      } else {
        return null;
      };
    });
  });
  
