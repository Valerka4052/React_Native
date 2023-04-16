import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDUtyqxJIOsBZKBC-EP-KK_0ubz--2asmo",
  authDomain: "rn-social-project-bfa0b.firebaseapp.com",
  projectId: "rn-social-project-bfa0b",
  storageBucket: "rn-social-project-bfa0b.appspot.com",
  messagingSenderId: "617444830428",
  appId: "1:617444830428:web:0b7db10db0bce52dde5819",
  measurementId: "G-QPRP62R8K5",
  databaseURL: "https://postImage.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // ..
  // });
// const auth = getAuth(app); 
// export const signIn = async ({ name, email, password }) => {
//   try {
//      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//   console.log(userCredential);
//   return userCredential.user
    
//   } catch (error) {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   }
// };
   
// export const logIn = async ({ email, password }) => {
//   try {
//      const userCredential = await signInWithEmailAndPassword(auth, email, password);
//   console.log(userCredential);
//   return userCredential.user
    
//   } catch (error) {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   }
//    };